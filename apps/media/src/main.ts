import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import type { TEnv } from "@repo/config/env";

import { MediaModule } from "./app.module";

const logger = new Logger("Bootstrap");

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  // configs
  const config = app.get(ConfigService<TEnv>);
  const PORT = config.getOrThrow("MEDIA_SERVICE_PORT", { infer: true });

  // Websocket setup
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(PORT);

  logger.log(`App started on port ${PORT}`);
}

void bootstrap();
