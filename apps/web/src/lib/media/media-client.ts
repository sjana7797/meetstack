import { Device } from "mediasoup-client";
import { Consumer, Producer, Transport } from "mediasoup-client/types";

type Message = {
  event: string;
  data: any;
};

export class MediaClient {
  private socket: WebSocket;

  private device: Device;

  private sendTransport: Transport;
  private receiveTransport: Transport;

  private producers = new Map<string, Producer>();

  private consumers = new Map<string, Consumer>();

  private pending = new Map<
    string,
    {
      resolve: (data: any) => void;
      reject: (error: Error) => void;
    }
  >();

  private requestCounter = 0;

  private participantId?: string;

  async connect(url: string): Promise<void> {
    this.socket = new WebSocket(url);

    await new Promise<void>((resolve, reject) => {
      this.socket.onopen = () => {
        resolve();
      };

      this.socket.onerror = () => {
        reject(new Error("WebSocket connection failed"));
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };
    });
  }

  private handleMessage(message: Message) {
    const { event, data } = message;

    if (data?.requestId && this.pending.has(data.requestId)) {
      const request = this.pending.get(data.requestId)!;

      this.pending.delete(data.requestId);

      request.resolve(data);

      return;
    }

    if (event === "new_producer") {
      void this.handleNewProducer(data);
    }

    if (event === "consumer_closed") {
      const consumer = this.consumers.get(data.consumerId);

      consumer?.close();

      this.consumers.delete(data.consumerId);
    }
  }

  private send(event: string, data: any = {}) {
    this.socket.send(
      JSON.stringify({
        event,
        data,
      }),
    );
  }

  private request(event: string, data: any = {}): Promise<any> {
    const requestId = `${Date.now()}-${++this.requestCounter}`;

    return new Promise((resolve, reject) => {
      this.pending.set(requestId, {
        resolve,
        reject,
      });

      this.send(event, {
        ...data,
        requestId,
      });
    });
  }

  async joinRoom(roomId: string, userId: string) {
    const response = await this.request("join_room", {
      roomId,
      userId,
    });

    this.participantId = response.participantId;

    this.device = await Device.factory();

    await this.device.load({
      routerRtpCapabilities: response.routerRtpCapabilities,
    });

    return {
      participantId: response.participantId,

      existingProducers: response.existingProducers,
    };
  }

  async createSendTransport() {
    const data = await this.request("create_webrtc_transport", {
      direction: "send",
    });

    this.sendTransport = this.device.createSendTransport({
      id: data.id,

      iceParameters: data.iceParameters,

      iceCandidates: data.iceCandidates,

      dtlsParameters: data.dtlsParameters,
    });

    this.sendTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this.request("connect_webrtc_transport", {
            transportId: this.sendTransport!.id,

            dtlsParameters,
          });

          callback();
        } catch (error) {
          errback(error as Error);
        }
      },
    );

    this.sendTransport.on(
      "produce",
      async ({ kind, rtpParameters, appData }, callback, errback) => {
        try {
          const response = await this.request("produce", {
            transportId: this.sendTransport!.id,

            kind,

            rtpParameters,

            appData,
          });

          callback({
            id: response.producerId,
          });
        } catch (error) {
          errback(error as Error);
        }
      },
    );

    return this.sendTransport;
  }

  async createRecvTransport() {
    const data = await this.request("create_webrtc_transport", {
      direction: "recv",
    });

    this.receiveTransport = this.device.createRecvTransport({
      id: data.id,

      iceParameters: data.iceParameters,

      iceCandidates: data.iceCandidates,

      dtlsParameters: data.dtlsParameters,
    });

    this.receiveTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this.request("connect_webrtc_transport", {
            transportId: this.receiveTransport!.id,

            dtlsParameters,
          });

          callback();
        } catch (error) {
          errback(error as Error);
        }
      },
    );

    return this.receiveTransport;
  }

  async produceTrack(track: MediaStreamTrack) {
    if (!this.sendTransport) {
      throw new Error("Send transport not created");
    }

    const producer = await this.sendTransport.produce({
      track,
    });

    this.producers.set(producer.id, producer);

    return producer;
  }

  async consumeProducer(producerId: string) {
    if (!this.receiveTransport) {
      throw new Error("Receive transport not created");
    }

    const response = await this.request("consume", {
      producerId,

      rtpCapabilities: this.device.recvRtpCapabilities,
    });

    const consumer = await this.receiveTransport.consume({
      id: response.id,

      producerId: response.producerId,

      kind: response.kind,

      rtpParameters: response.rtpParameters,
    });

    this.consumers.set(consumer.id, consumer);

    await this.request("resume_consumer", {
      consumerId: consumer.id,
    });

    return consumer;
  }

  getParticipantId() {
    return this.participantId;
  }

  getDevice() {
    return this.device;
  }

  close() {
    for (const producer of this.producers.values()) {
      producer.close();
    }

    for (const consumer of this.consumers.values()) {
      consumer.close();
    }

    this.sendTransport?.close();
    this.receiveTransport?.close();

    this.socket?.close();
  }

  private async handleNewProducer(data: any) {
    try {
      const consumer = await this.consumeProducer(data.producerId);

      const event = new CustomEvent("remote-track", {
        detail: {
          producerId: data.producerId,

          participantId: data.participantId,

          userId: data.userId,

          kind: data.kind,

          track: consumer.track,
        },
      });

      window.dispatchEvent(event);
    } catch (error) {
      console.error("Failed to consume producer", error);
    }
  }
}
