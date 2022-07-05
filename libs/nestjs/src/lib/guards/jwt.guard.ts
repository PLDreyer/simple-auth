import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_HANDLER } from '../constants';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
    console.log('error: ', error);
    console.log('user: ', user);
    console.log('info: ', info);
    if (error || info) {
      if (this.authHandler.options.error)
        return this.authHandler.options.error(info);
      throw info;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
