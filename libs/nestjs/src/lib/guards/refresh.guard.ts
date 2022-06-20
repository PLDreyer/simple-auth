import {ExecutionContext, Inject, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthError, AuthListException, AuthOptions, ExpiredJwtRefresh, InternalAuthError} from "@simple-auth/core";
import {TokenExpiredError} from "jsonwebtoken";

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
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

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || info) {
      const errors: Array<AuthError> = []

      if(info instanceof TokenExpiredError) errors.push(
        new ExpiredJwtRefresh(),
      );

      if(errors.length === 0) errors.push(
        new InternalAuthError(),
      );

      const exception = new AuthListException(errors);
      if(this.authOptions.error) return this.authOptions.error(exception)

      throw exception;
    }

    return user;
  }
}
