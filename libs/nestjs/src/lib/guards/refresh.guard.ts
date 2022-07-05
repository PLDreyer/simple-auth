import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_HANDLER } from '../constants';
import {
  AuthError,
  AuthListException,
  ExpiredJwtRefresh,
  InternalAuthError,
  InvalidJwtRefresh,
} from '../auth.exceptions';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
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
    if (err || info) {
      const errors: Array<AuthError> = [];

      if (info instanceof ExpiredJwtRefresh) errors.push(info);
      if (info instanceof InvalidJwtRefresh) errors.push(info);

      if (errors.length === 0) errors.push(new InternalAuthError());

      const exception = new AuthListException(errors);
      if (this.authHandler.options.error)
        return this.authHandler.options.error(exception);

      throw exception;
    }

    return user;
  }
}
