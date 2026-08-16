import { Injectable, Logger } from "@nestjs/common";
import {
  MediaKind,
  Producer,
  RtpParameters,
  WebRtcTransport,
} from "mediasoup/types";

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  async createProducer(
    transport: WebRtcTransport,
    kind: MediaKind,
    rtpParameters: RtpParameters,
  ): Promise<Producer> {
    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    producer.on("transportclose", () => {
      this.logger.log(`Producer transport closed: ${producer.id}`);
    });

    producer.on("score", () => {
      this.logger.log(producer.score, `Producer score: ${producer.id}`);
    });

    return producer;
  }
}
