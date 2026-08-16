import { type IAuthTokenPayload, verifyAuthToken } from "@app/auth-verify";
import { ConsumerService } from "@media/modules/mediasoup/consumer/consumer.service";
import { ParticipantsService } from "@media/modules/mediasoup/participants/particcipants.service";
import { ProducerService } from "@media/modules/mediasoup/producer/producer.service";
import { RoomsService } from "@media/modules/mediasoup/rooms/rooms.service";
import { TransportService } from "@media/modules/mediasoup/transport/transport.service";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from "@nestjs/websockets";
import type { IncomingMessage } from "http";
import type {
  DtlsParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters,
  WebRtcTransport,
} from "mediasoup/types";
import type { WebSocket } from "ws";

interface IJoinRoomData {
  roomId: string;
  requestId?: string;
}

interface ICreateTransportData {
  roomId: string;
  direction: "send" | "recv";
  requestId?: string;
}

interface IConnectTransportData {
  transportId: string;
  dtlsParameters: DtlsParameters;
  requestId?: string;
}

interface IProduceData {
  transportId: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  appData?: Record<string, unknown>;
  requestId?: string;
}

interface IConsumeData {
  roomId: string;
  producerId: string;
  rtpCapabilities: RtpCapabilities;
  requestId?: string;
}

interface IResumeConsumerData {
  consumerId: string;
  requestId?: string;
}

@WebSocketGateway({
  path: "/media",
})
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly roomService: RoomsService,
    private readonly participantService: ParticipantsService,

    private readonly transportService: TransportService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  private readonly authenticatedSockets = new Map<
    WebSocket,
    IAuthTokenPayload
  >();

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const token = new URLSearchParams(
      request.url?.split("?")[1] ?? "",
    ).get("token");

    if (!token) {
      client.close(4001, "Unauthorized");

      return;
    }

    try {
      const payload = await verifyAuthToken(token);

      this.authenticatedSockets.set(client, payload);
    } catch {
      client.close(4001, "Unauthorized");
    }
  }

  private send(socket: WebSocket, event: string, data: unknown) {
    if (socket.readyState !== 1) {
      return;
    }

    socket.send(
      JSON.stringify({
        event,
        data,
      }),
    );
  }

  private broadcast(
    sockets: WebSocket[],
    event: string,
    data: unknown,
    except?: WebSocket,
  ) {
    for (const socket of sockets) {
      if (socket === except) {
        continue;
      }

      this.send(socket, event, data);
    }
  }

  private reply(
    event: string,
    data: Record<string, unknown>,
    requestId?: string,
  ): WsResponse<unknown> {
    return {
      event,
      data: requestId ? { ...data, requestId } : data,
    };
  }

  private findParticipantByTransport(transportId: string) {
    const participants = this.participantService.getParticipantsByRoom("");

    return participants.find(
      (participant) =>
        participant.sendTransport?.id === transportId ||
        participant.receiveTransport?.id === transportId,
    );
  }

  @SubscribeMessage("join_room")
  async joinRoom(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: IJoinRoomData,
  ): Promise<WsResponse<unknown>> {
    const { roomId, requestId } = data;
    const identity = this.authenticatedSockets.get(socket);

    if (!identity) {
      return this.reply("error", { message: "Unauthenticated" }, requestId);
    }

    if (!roomId) {
      return this.reply(
        "error",
        { message: "roomId is required" },
        requestId,
      );
    }

    const userId = identity.id;
    const room = await this.roomService.getOrCreateRoom(roomId);
    const participant = this.participantService.createParticipant(
      userId,
      roomId,
      socket,
    );
    const existingParticipants = this.participantService
      .getParticipantsByRoom(roomId)
      .filter((item) => item.id !== participant.id);
    const existingProducers = existingParticipants.flatMap((item) =>
      [...item.producers.values()].map((producer) => ({
        producerId: producer.id,
        participantId: item.id,
        userId: item.userId,
        kind: producer.kind,
        appData: producer.appData,
      })),
    );

    this.broadcast(
      existingParticipants.map((item) => item.socket),
      "participant_joined",
      {
        participantId: participant.id,
        userId: participant.userId,
      },
    );

    return this.reply(
      "joined_room",
      {
        participantId: participant.id,
        roomId,
        routerRtpCapabilities: room.router.rtpCapabilities,
        existingProducers,
      },
      requestId,
    );
  }

  @SubscribeMessage("create_webrtc_transport")
  async createWebRtcTransport(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: ICreateTransportData,
  ): Promise<WsResponse<unknown>> {
    const participant = this.participantService.getParticipantBySocket(socket);

    if (!participant) {
      return this.reply(
        "error",
        { message: "Participant not found" },
        data.requestId,
      );
    }

    const room = this.roomService.getRoom(participant.roomId);

    if (!room) {
      return this.reply(
        "error",
        { message: "Room not found" },
        data.requestId,
      );
    }

    const transport = await this.transportService.createWebRTCTransport(
      room.router,
    );

    if (data.direction === "send") {
      participant.sendTransport = transport;
    } else {
      participant.receiveTransport = transport;
    }

    transport.on("@close", () => {
      if (participant.sendTransport?.id === transport.id) {
        participant.sendTransport = undefined;
      }

      if (participant.receiveTransport?.id === transport.id) {
        participant.receiveTransport = undefined;
      }
    });

    return this.reply(
      "webrtc_transport_created",
      {
        direction: data.direction,
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
        sctpParameters: transport.sctpParameters,
      },
      data.requestId,
    );
  }

  @SubscribeMessage("connect_webrtc_transport")
  async connectWebRtcTransport(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody()
    data: IConnectTransportData,
  ): Promise<WsResponse<unknown>> {
    const participant = this.participantService.getParticipantBySocket(socket);

    if (!participant) {
      return this.reply(
        "error",
        { message: "Participant not found" },
        data.requestId,
      );
    }

    let transport: WebRtcTransport | undefined;

    if (participant.sendTransport?.id === data.transportId) {
      transport = participant.sendTransport;
    }

    if (participant.receiveTransport?.id === data.transportId) {
      transport = participant.receiveTransport;
    }

    if (!transport) {
      return this.reply(
        "error",
        { message: "Transport not found" },
        data.requestId,
      );
    }

    await transport.connect({
      dtlsParameters: data.dtlsParameters,
    });

    return this.reply(
      "webrtc_transport_connected",
      { transportId: transport.id },
      data.requestId,
    );
  }

  @SubscribeMessage("produce")
  async produce(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: IProduceData,
  ): Promise<WsResponse<unknown>> {
    const participant = this.participantService.getParticipantBySocket(socket);

    if (!participant) {
      return this.reply(
        "error",
        { message: "Participant not found" },
        data.requestId,
      );
    }

    const transport = participant.sendTransport;

    if (!transport) {
      return this.reply(
        "error",
        { message: "Send transport not found" },
        data.requestId,
      );
    }

    if (transport.id !== data.transportId) {
      return this.reply(
        "error",
        { message: "Invalid transport" },
        data.requestId,
      );
    }

    const producer = await this.producerService.createProducer(
      transport,
      data.kind,
      data.rtpParameters,
    );

    participant.producers.set(producer.id, producer);

    producer.on("transportclose", () => {
      participant.producers.delete(producer.id);
    });

    const roomParticipants = this.participantService.getParticipantsByRoom(
      participant.roomId,
    );

    this.broadcast(
      roomParticipants.map((item) => item.socket),
      "new_producer",
      {
        producerId: producer.id,
        participantId: participant.id,
        userId: participant.userId,
        kind: producer.kind,
        appData: producer.appData,
      },
      socket,
    );

    return this.reply(
      "produced",
      { producerId: producer.id },
      data.requestId,
    );
  }

  @SubscribeMessage("consume")
  async consume(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: IConsumeData,
  ): Promise<WsResponse<unknown>> {
    const participant = this.participantService.getParticipantBySocket(socket);

    if (!participant) {
      return this.reply(
        "error",
        { message: "Participant not found" },
        data.requestId,
      );
    }

    const room = this.roomService.getRoom(participant.roomId);

    if (!room) {
      return this.reply(
        "error",
        { message: "Room not found" },
        data.requestId,
      );
    }

    const recvTransport = participant.receiveTransport;

    if (!recvTransport) {
      return this.reply(
        "error",
        { message: "Receive transport not found" },
        data.requestId,
      );
    }

    const producerParticipant = this.participantService
      .getParticipantsByRoom(participant.roomId)
      .find((item) => item.producers.has(data.producerId));

    if (!producerParticipant) {
      return this.reply(
        "error",
        { message: "Producer not found" },
        data.requestId,
      );
    }

    const producer = producerParticipant.producers.get(data.producerId);

    if (!producer) {
      return this.reply(
        "error",
        { message: "Producer not found" },
        data.requestId,
      );
    }

    const consumer = await this.consumerService.createConsumer(
      room.router,
      recvTransport,
      producer,
      data.rtpCapabilities,
    );

    participant.consumers.set(consumer.id, consumer);

    consumer.on("transportclose", () => {
      participant.consumers.delete(consumer.id);
    });

    consumer.on("producerclose", () => {
      participant.consumers.delete(consumer.id);

      this.send(socket, "consumer_closed", {
        consumerId: consumer.id,
        producerId: producer.id,
      });
    });

    return this.reply(
      "consumer_created",
      {
        id: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      },
      data.requestId,
    );
  }

  @SubscribeMessage("resume_consumer")
  async resumeConsumer(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody()
    data: IResumeConsumerData,
  ): Promise<WsResponse<unknown>> {
    const participant = this.participantService.getParticipantBySocket(socket);

    if (!participant) {
      return this.reply(
        "error",
        { message: "Participant not found" },
        data.requestId,
      );
    }

    const consumer = participant.consumers.get(data.consumerId);

    if (!consumer) {
      return this.reply(
        "error",
        { message: "Consumer not found" },
        data.requestId,
      );
    }

    await consumer.resume();

    return this.reply(
      "consumer_resumed",
      { consumerId: consumer.id },
      data.requestId,
    );
  }

  @SubscribeMessage("leave_room")
  async leaveRoom(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody() data: { requestId?: string },
  ): Promise<WsResponse<unknown>> {
    this.cleanupParticipant(socket);

    return this.reply("left_room", {}, data?.requestId);
  }

  handleDisconnect(socket: WebSocket) {
    this.cleanupParticipant(socket);
  }

  private cleanupParticipant(socket: WebSocket) {
    this.authenticatedSockets.delete(socket);

    const participant = this.participantService.getParticipantBySocket(socket);

    if (!participant) {
      return;
    }

    const roomId = participant.roomId;
    const participantId = participant.id;

    this.participantService.removeParticipant(participantId);

    const remaining = this.participantService.getParticipantsByRoom(roomId);

    this.broadcast(
      remaining.map((item) => item.socket),
      "participant_left",
      {
        participantId,
      },
    );
  }
}
