import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "@repo/config/env";
import { LoggerModule, pinoConfig } from "@repo/config/pino";
import { DatabaseModule } from "@repo/db/nestjs";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

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
