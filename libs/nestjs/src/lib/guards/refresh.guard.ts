import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_MODULE_OPTIONS } from '../constants';
import {
  AuthError,
  AuthListException,
  AuthOptions,
  ExpiredJwtRefresh,
  InternalAuthError,
  InvalidJwtRefresh,
  RefreshToken,
} from '@simple-auth/core';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  public handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || (info && !(info instanceof RefreshToken))) {
      const errors: Array<AuthError> = [];

      if (info instanceof ExpiredJwtRefresh) errors.push(info);
      if (info instanceof InvalidJwtRefresh) errors.push(info);

      if (errors.length === 0) errors.push(new InternalAuthError());

      const exception = new AuthListException(errors);
      if (this.authOptions.error) return this.authOptions.error(exception);

      throw exception;
    }

    return user;
  }
}
