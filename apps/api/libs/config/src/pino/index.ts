import type { IncomingMessage } from "node:http";

import type { TEnv } from "@app/config/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { LoggerModuleAsyncParams } from "pino-nestjs";
import { v7 as uuidv7 } from "uuid";

export const pinoConfig: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService<TEnv>) => {
    const pretty = config.getOrThrow("PRETTY_LOGS", { infer: true }) !== false;

    return {
      pinoHttp: {
        genReqId: (req: IncomingMessage) =>
          (req.headers["x-request-id"] as string) ?? uuidv7(),
        transport: pretty
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                singleLine: true,
                label: "NestJS",
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
              },
            }
          : undefined,
      },
    };
  },
};
