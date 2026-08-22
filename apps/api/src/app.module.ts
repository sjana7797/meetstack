import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "@repo/config/env";
import { pinoConfig } from "@repo/config/pino";
import { LoggerModule } from "pino-nestjs";

import { ApiModule } from "./modules/api.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    // All API Modules
    ApiModule,

    // Logger Config
    LoggerModule.forRootAsync(pinoConfig),
  ],
})
export class GatewayModule {}
