import { Hono } from "hono";
import { auth } from "@repo/auth/auth";

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

Bun.serve({
  port: Number(process.env.AUTH_SERVICE_PORT ?? 5002),
  fetch: app.fetch,
});
