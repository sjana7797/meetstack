import { Controller, Get } from "@nestjs/common";
import { TUser } from "@repo/db";

import { USER_ROUTES } from "@/constants/routes";
import { API_VERSIONS } from "@/constants/version";

import { UserService } from "./user.service";

@Controller({
  path: USER_ROUTES.BASE,
  version: API_VERSIONS.ONE,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(USER_ROUTES.GET_ME)
  getUserMe(): Promise<TUser> {
    return this.userService.getUserMe();
  }
}
