import { Injectable } from "@nestjs/common";
import { HealthCheckService, MemoryHealthIndicator } from "@nestjs/terminus";

import { InfrastructureHealthIndicator } from "./indicators/infrastructure.health";

const HEAP_LIMIT_BYTES = 512 * 1024 * 1024;
const RSS_LIMIT_BYTES = 1024 * 1024 * 1024;

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly infrastructure: InfrastructureHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  healthStatus() {
    return this.health.check([
      //   () => this.infrastructure.isDatabaseHealthy("database"),
      //   () => this.infrastructure.isRedisHealthy("redis"),
      () => this.memory.checkHeap("memory_heap", HEAP_LIMIT_BYTES),
      () => this.memory.checkRSS("memory_rss", RSS_LIMIT_BYTES),
    ]);
  }
}
