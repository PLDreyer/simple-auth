import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthListException } from '../auth.exceptions';
import { AUTH_HANDLER } from '../constants';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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

  public handleRequest(error: unknown, user: Express.User, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (error || info) {
      const exception = new AuthListException([info]);
      if (this.authHandler.options.error)
        return this.authHandler.options.error(exception);
      throw exception;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
