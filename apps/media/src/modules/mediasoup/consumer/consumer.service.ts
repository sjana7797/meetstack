import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import {
  Consumer,
  Producer,
  Router,
  RtpCapabilities,
  WebRtcTransport,
} from "mediasoup/types";

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  async createConsumer(
    router: Router,
    transport: WebRtcTransport,
    producer: Producer,
    rtpCapabilities: RtpCapabilities,
  ): Promise<Consumer> {
    const canConsume = router.canConsume({
      producerId: producer.id,
      rtpCapabilities,
    });

    if (!canConsume) {
      throw new BadRequestException("Client can't consume this producer");
    }

    const consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true,
    });

    consumer.on("transportclose", () => {
      this.logger.log(`Consumer transport closed: ${consumer.id}`);
    });

    consumer.on("producerclose", () => {
      this.logger.log(`Producer closed for the consumer: ${consumer.id}`);
    });

    return consumer;
  }
}
