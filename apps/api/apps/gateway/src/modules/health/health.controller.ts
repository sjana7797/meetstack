import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ResponseMessage } from "@/common/decorators";
import { HEALTH_ROUTES } from "@/constants/routes";
import { Public } from "@/modules/auth/decorators";

import { HealthService } from "./health.service";

@ApiTags("Health")
@Controller(HEALTH_ROUTES.BASE)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ResponseMessage("Health Status OK")
  @ApiOperation({
    summary: "Get the health status",
  })
  healthStatus() {
    return this.healthService.healthStatus();
  }
}
