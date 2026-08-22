import z from "zod";

const mediaServiceSchema = z.object({
  MEDIA_SERVICE_PORT: z.coerce.number().int().positive().default(5001),
  MEDIA_LISTEN_IP: z.string().min(4).default("0.0.0.0"),
  MEDIA_ANNOUNCED_ADDRESS: z.string().default("127.0.0.1"),
  MEDIA_MIN_PORT: z.coerce.number().default(40000),
  MEDIA_MAX_PORT: z.coerce.number().default(40100),
});
const databaseSchema = z.object({
  DATABASE_URL: z.url(),
});
const authSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  AUTH_SERVICE_PORT: z.coerce.number().int().positive().default(5002),
});
const redisSchema = z.object({
  REDIS_HOST: z.string().min(1).default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_NAMESPACE: z.string().min(1).default("meetstack"),
});
const bullMqSchema = z.object({
  QUEUE_CONCURRENCY: z.coerce.number().default(5),

  // Bull board
  BULL_BOARD_USER: z.string().min(1),
  BULL_BOARD_PASSWORD: z.string().min(8),
});
const apiSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  TRUSTED_PROXIES: z.string().default(""),
  CORS_ORIGINS: z.string().default(""),
});

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "local"])
      .default("development"),
    PRETTY_LOGS: z
      .string()
      .default("false")
      .transform((v) => v === "true"),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace"])
      .default("trace"),
  })
  .and(apiSchema)
  .and(databaseSchema)
  .and(redisSchema)
  .and(bullMqSchema)
  .and(mediaServiceSchema)
  .and(authSchema);

export type TEnv = z.infer<typeof envSchema>;
