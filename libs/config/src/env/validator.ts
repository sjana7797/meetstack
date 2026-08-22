import z from "zod";

import { envSchema, type TEnv } from "./schema.ts";

export function validateEnv(config: Record<string, unknown>): TEnv {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error(z.treeifyError(result.error));

    throw result.error;
  }

  return result.data;
}
