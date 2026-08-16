import type { TEnv } from "@app/config/env";
import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import cookieParser from "cookie-parser";
import basicAuth from "express-basic-auth";
import helmet from "helmet";
import { Logger } from "pino-nestjs";

import { ResponseInterceptor } from "@/common/interceptors";
import {
  API_PREFIX,
  BULL_BOARD_MOUNTED_ROUTE,
  SWAGGER_DOCS_ROUTE,
} from "@/constants/routes";
import { API_VERSIONS } from "@/constants/version";
import { GatewayModule } from "@/gateway.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule, {
    bufferLogs: true,
  });

  // prefix
  app.setGlobalPrefix(API_PREFIX);
  // config
  const config = app.get(ConfigService<TEnv>);
  // logger
  const logger = app.get(Logger);

  app.useLogger(logger);

  const trustedProxies = config
    .getOrThrow("TRUSTED_PROXIES", { infer: true })
    .split(",")
    .map((proxy) => proxy.trim())
    .filter(Boolean);

  if (trustedProxies.length) {
    app.set("trust proxy", trustedProxies);
    logger.log(`Trusting proxies: ${trustedProxies.join(", ")}`, "Bootstrap");
  }

  // cors
  const corsOrigins = config
    .getOrThrow("CORS_ORIGINS", {
      infer: true,
    })
    .split(",");

  logger.log(`CORS origins: ${corsOrigins.join(", ")}`, "Bootstrap");
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSIONS.ONE,
  });

  // security
  app.use(helmet());
  // cookies
  app.use(cookieParser());
  // compression
  app.use(compression());

  app.use(
    BULL_BOARD_MOUNTED_ROUTE,
    basicAuth({
      challenge: true,
      users: {
        [config.getOrThrow("BULL_BOARD_USER", { infer: true })]:
          config.getOrThrow("BULL_BOARD_PASSWORD", { infer: true }),
      },
    }),
  );

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Meetstack API")
    .setDescription("Meetstack API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_DOCS_ROUTE, app, document);

  // interceptors
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // bootstrapping
  const PORT = config.getOrThrow("PORT", {
    infer: true,
  });

  logger.log(`Bootstrapping the application`, "Bootstrap");
  logger.log(`Environment: ${config.get("NODE_ENV")}`, "Bootstrap");
  logger.log(
    `Swagger docs available at http://localhost:${PORT}/api/docs`,
    "Bootstrap",
  );
  logger.log(`Listening on port ${PORT}`, "Bootstrap");
  await app.listen(PORT);
}

bootstrap();
