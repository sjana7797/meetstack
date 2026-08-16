import { TEnv } from "@app/config/env";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Router, WebRtcTransport } from "mediasoup/types";

@Injectable()
export class TransportService {
  private readonly logger = new Logger(TransportService.name);

  constructor(private readonly configService: ConfigService<TEnv>) {}

  async createWebRTCTransport(router: Router): Promise<WebRtcTransport> {
    const listenIp = this.configService.getOrThrow("MEDIA_LISTEN_IP", {
      infer: true,
    });
    const announcedAddress = this.configService.getOrThrow(
      "MEDIA_ANNOUNCED_ADDRESS",
      { infer: true },
    );
    const minPort = this.configService.getOrThrow("MEDIA_MIN_PORT", {
      infer: true,
    });
    const maxPort = this.configService.getOrThrow("MEDIA_MAX_PORT", {
      infer: true,
    });
    const transport = await router.createWebRtcTransport({
      listenInfos: [
        {
          protocol: "udp",
          ip: listenIp,
          announcedAddress,
          portRange: {
            min: minPort,
            max: maxPort,
          },
        },
        {
          protocol: "tcp",
          ip: listenIp,
          announcedAddress,
          portRange: {
            min: minPort,
            max: maxPort,
          },
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferTcp: true,

      initialAvailableOutgoingBitrate: 1_000_000,

      enableSctp: false,
    });

    transport.on("dtlsstatechange", (state) => {
      if (state === "closed") {
        transport.close();
      }
    });

    transport.on("@close", () => {
      this.logger.log(`WebRTC transport closed: ${transport.id}`);
    });

    return transport;
  }
}
