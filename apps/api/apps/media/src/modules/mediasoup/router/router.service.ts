import { WorkerService } from "@media/modules/mediasoup/worker/worker.service";
import { Injectable } from "@nestjs/common";
import { Router } from "mediasoup/types";

@Injectable()
export class RouterService {
  constructor(private readonly workerService: WorkerService) {}

  async createRouter(): Promise<Router> {
    const worker = this.workerService.getWorker();
    const router = await worker.createRouter({
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48_000,
          channels: 2,
        },
        {
          kind: "video",
          mimeType: "video/VP8",
          clockRate: 90_000,
        },
      ],
    });

    return router;
  }
}
