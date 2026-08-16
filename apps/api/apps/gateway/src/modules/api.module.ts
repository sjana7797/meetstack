import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health";

@Module({
  imports: [AuthModule, HealthModule],
})
export class ApiModule {}
