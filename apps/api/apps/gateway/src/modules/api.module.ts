import { DatabaseModule } from "@app/database";
import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, HealthModule, UserModule, DatabaseModule],
})
export class ApiModule {}
