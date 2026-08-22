import { NestFactory } from "@nestjs/core";
import type { MicroserviceOptions } from "@nestjs/microservices";
import { Transport } from "@nestjs/microservices";
import { Logger } from "@repo/config/pino";

import { UserModule } from "./user.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      bufferLogs: true,
      transport: Transport.TCP,
      options: {
        host: "localhost",
        port: 5003,
      },
    },
  );
  // logger
  const logger = app.get(Logger);

  app.useLogger(logger);

  logger.log(`User service started on port ${5003}`);
}

bootstrap();
