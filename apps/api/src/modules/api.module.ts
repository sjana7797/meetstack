import { Module } from "@nestjs/common";
import { DatabaseModule } from "@repo/db/nestjs";

import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, HealthModule, UserModule, DatabaseModule],
})
export class ApiModule {}
