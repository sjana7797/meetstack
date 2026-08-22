import { Injectable, Logger } from "@nestjs/common";
import type { HealthIndicatorResult } from "@nestjs/terminus";
import { HealthIndicatorService } from "@nestjs/terminus";
import { DatabaseService } from "@repo/db/nestjs";
import { sql } from "drizzle-orm";

// import { cacheRedis } from "@repo/queue";
// import { sql } from "drizzle-orm";
import { withTimeout } from "./with-timeout";

@Injectable()
export class InfrastructureHealthIndicator {
  private readonly logger = new Logger(InfrastructureHealthIndicator.name);

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly database: DatabaseService,
  ) {}

  async isDatabaseHealthy<Key extends string>(
    key: Key,
  ): Promise<HealthIndicatorResult<Key>> {
    return this.probe(key, () => this.database.db.execute(sql`select 1`));
  }

  // async isRedisHealthy<Key extends string>(
  //   key: Key,
  // ): Promise<HealthIndicatorResult<Key>> {
  //   // ioredis queues commands while disconnected rather than rejecting them, so
  //   // this call can sit indefinitely without the timeout in `probe`.
  //   return this.probe(key, () => cacheRedis.ping());
  // }

  private async probe<Key extends string>(
    key: Key,
    operation: () => Promise<unknown>,
  ): Promise<HealthIndicatorResult<Key>> {
    const indicator = this.healthIndicatorService.check(key);
    const startedAt = Date.now();

    try {
      await withTimeout(operation());

      return indicator.up({ responseTimeMs: Date.now() - startedAt });
    } catch (error) {
      this.logger.error(
        `Health check "${key}" failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      return indicator.down({ responseTimeMs: Date.now() - startedAt });
    }
  }
}
