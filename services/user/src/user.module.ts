import { DatabaseModule } from "@repo/db/nestjs";
import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { LoggerModule, pinoConfig } from "@repo/config/pino";
import { validateEnv } from "@repo/config/env";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    DatabaseModule,
    // Logger Config
    LoggerModule.forRootAsync(pinoConfig),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
