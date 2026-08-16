import { validateEnv } from "@app/config/env";
import { pinoConfig } from "@app/config/pino";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
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
