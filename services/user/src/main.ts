import { NestFactory } from "@nestjs/core";

import { UserModule } from "./user.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@repo/config/pino";

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
