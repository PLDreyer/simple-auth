import {ExecutionContext, Inject, Injectable, Res, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthError, AuthOptions} from "@simple-auth/core";

@Injectable()
export class KeyAuthGuard extends AuthGuard("key") {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
  ) {
    super();
  }

  handleRequest(err: unknown, user: unknown, info: AuthError, ctx: ExecutionContext, status: unknown) {
    // You can throw an exception based on either "info" or "err" arguments
    console.log("this.authOptions: ", this.authOptions)
    console.log("err: ", err);
    console.log("user: ", user);
    console.log("info: ", info);
    // console.log("ctx: ", ctx);
    console.log("status: ", status);
    if (err) {
      throw err;
    }

    if (info) {
      if (this.authOptions.error) return this.authOptions.error(info);

    }
    return user as any;
  }
}
