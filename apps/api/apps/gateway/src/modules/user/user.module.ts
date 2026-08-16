import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    ClientsModule.register([
      {
        name: "USER_CLIENT",
        transport: Transport.TCP,
        options: { port: 5002 },
      },
    ]),
  ],
})
export class UserModule {}
