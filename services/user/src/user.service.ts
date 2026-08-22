import { Injectable, NotFoundException } from "@nestjs/common";
import { TUser } from "@repo/db";
import { DatabaseService } from "@repo/db/nestjs";

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    // private readonly logger: Logger,
  ) {}

  async findUserById(): Promise<TUser> {
    const user = await this.databaseService.db.query.users.findFirst({
      where: {
        id: "hh",
      },
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }
}
