import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TUser } from "@repo/db";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_CLIENT") private readonly userClient: ClientProxy,
  ) {}

  getUserMe(): Promise<TUser> {
    const response = this.userClient.send<TUser>("user.get", {});

    return firstValueFrom(
      response.pipe(
        catchError(() => {
          throw new NotFoundException("User not found");
        }),
      ),
    );
  }
}
