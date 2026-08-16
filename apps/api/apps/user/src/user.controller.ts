import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { TUser } from "@repo/db";

import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern("user.get")
  findUserById(): Promise<TUser> {
    return this.userService.findUserById();
  }
}
