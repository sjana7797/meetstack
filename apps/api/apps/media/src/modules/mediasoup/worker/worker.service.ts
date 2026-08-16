import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import * as mediasoup from "mediasoup";
import { Worker } from "mediasoup/types";

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private worker!: Worker;
  private readonly logger = new Logger(WorkerService.name);
  constructor() {}

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      logLevel: "warn",
      logTags: ["info", "ice", "dtls", "rtcp", "rtp", "srtp"],
    });

    this.worker.on("died", (error) => {
      this.logger.error(`mediasoup worker died: ${error.message}`);

      process.exit(1);
    });

    this.logger.log(`mediasoup worker started: pid=${this.worker.pid}`);
  }

  getWorker(): Worker {
    if (!this.worker) {
      throw new Error(`mediasoup worker not initialized`);
    }

    return this.worker;
  }

  onModuleDestroy() {
    if (!this.worker) return;

    this.worker.close();

    this.logger.log("Media soup worker closed");
  }
}
