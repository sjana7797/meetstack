import { Injectable, Logger } from "@nestjs/common";
import type { HealthIndicatorResult } from "@nestjs/terminus";
import { HealthIndicatorService } from "@nestjs/terminus";

// import { DatabaseService } from "@stmaryhomecare/database";
// import { cacheRedis } from "@stmaryhomecare/queue";
// import { sql } from "drizzle-orm";
import { withTimeout } from "./with-timeout";

/**
 * Reachability probes for the two stateful dependencies Terminus has no
 * built-in indicator for.
 *
 * Terminus ships indicators for TypeORM, Mongoose, Sequelize, Prisma and
 * MikroORM — not Drizzle — and its Redis support only covers Redis used as a
 * microservice transport, which is not how this app uses it. Both are therefore
 * hand-rolled on `HealthIndicatorService`.
 *
 * They live on one class because they are the same probe with a different
 * command, and because a Nest constructor here is capped at three parameters.
 */
@Injectable()
export class InfrastructureHealthIndicator {
  private readonly logger = new Logger(InfrastructureHealthIndicator.name);

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    // private readonly database: DatabaseService,
  ) {}

  /**
   * Postgres, through the injected `DatabaseService` — so it exercises the same
   * pool Better Auth and every application query use. A probe holding a
   * connection of its own would report green while the real pool was exhausted.
   */
  //   async isDatabaseHealthy<Key extends string>(
  //     key: Key,
  //   ): Promise<HealthIndicatorResult<Key>> {
  //     return this.probe(key, () => this.database.db.execute(sql`select 1`));
  //   }

  /**
   * Redis, via the same singleton connection `CacheService` uses — imported
   * rather than injected for the same reason it is there: the connection is
   * built at module scope, before DI exists.
   *
   * The BullMQ connection is not probed separately. It is a set of options
   * rather than a live client and points at the same server, so a second `PING`
   * would add nothing.
   */
  //   async isRedisHealthy<Key extends string>(
  //     key: Key,
  //   ): Promise<HealthIndicatorResult<Key>> {
  //     // ioredis queues commands while disconnected rather than rejecting them, so
  //     // this call can sit indefinitely without the timeout in `probe`.
  //     return this.probe(key, () => cacheRedis.ping());
  //   }

  /**
   * Runs `operation` under a timeout and maps the outcome onto a Terminus
   * result.
   *
   * The failure reason is logged, never returned. Health routes are
   * `@AllowAnonymous()`, and these error messages carry connection details —
   * "password authentication failed for user postgres" names the user and
   * confirms the host to anyone who curls the endpoint.
   */
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
