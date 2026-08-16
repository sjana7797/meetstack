import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { relations } from "./relations.ts";
import * as schema from "./schema/index.ts";

export type TDatabase = NodePgDatabase<typeof relations>;

export type TUser = typeof schema.users.$inferSelect;
