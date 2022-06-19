import {ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {AuthError, AuthOptions} from "@simple-auth/core";
import {AUTH_MODULE_OPTIONS} from "../constants";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  public handleRequest(error: unknown, user: Express.User, info: AuthError, ctx: ExecutionContext, status: unknown): any{
    // You can throw an exception based on either "info" or "err" arguments
    if (error || info) {
      console.log("error: ", error);
      if (this.authOptions.error) return this.authOptions.error(info);
      throw info;
    }

    return user as any
  }
}
