import { validateEnv } from "@app/config/env";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { MediasoupModule } from "./modules/mediasoup/mediasoup.module";
import { SignalingModule } from "./modules/signaling/signaling.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    MediasoupModule,
    SignalingModule,
  ],
})
export class MediaModule {}
