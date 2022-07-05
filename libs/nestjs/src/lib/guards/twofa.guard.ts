import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthError, AuthListException } from '../auth.exceptions';
import { AUTH_HANDLER } from '../constants';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

@Injectable()
export class TwoFaAuthGuard extends AuthGuard(['twofa']) {
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

  public handleRequest(error, user, info: AuthError) {
    if (error || info) {
      const exception = new AuthListException([info]);
      if (this.authHandler.options.error)
        return this.authHandler.options.error(exception);
      throw exception;
    }

    return user;
  }
}
