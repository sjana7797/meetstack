import { Module } from "@nestjs/common";

import { ConsumerService } from "./consumer/consumer.service";
import { ProducerService } from "./producer/producer.service";
import { RoomsService } from "./rooms/rooms.service";
import { RouterService } from "./router/router.service";
import { TransportService } from "./transport/transport.service";
import { WorkerService } from "./worker/worker.service";

@Module({
  providers: [
    WorkerService,
    RouterService,
    TransportService,
    RoomsService,
    ProducerService,
    ConsumerService,
  ],
  exports: [
    WorkerService,
    RouterService,
    TransportService,
    RoomsService,
    ProducerService,
    ConsumerService,
  ],
})
export class MediasoupModule {}
