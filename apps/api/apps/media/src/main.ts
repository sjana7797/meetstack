import type { TEnv } from "@app/config/env";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";

import { MediaModule } from "./media.module";

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  // configs
  const config = app.get(ConfigService<TEnv>);
  const PORT = config.getOrThrow("MEDIA_SERVICE_PORT", { infer: true });

  // Websocket setup
  app.useWebSocketAdapter(new WsAdapter(app));
  console.log(PORT);
  console.log("App started");
  await app.listen(PORT);
}

void bootstrap();
