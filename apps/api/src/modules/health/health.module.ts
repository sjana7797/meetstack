import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { InfrastructureHealthIndicator } from "./indicators/infrastructure.health";

@Module({
  controllers: [HealthController],
  providers: [HealthService, InfrastructureHealthIndicator],
  imports: [TerminusModule],
})
export class HealthModule {}
