import { Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_HANDLER } from '../constants';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

@Injectable()
export class KeyAuthGuard extends AuthGuard('key') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {
    super();
  }

  public handleRequest(error: unknown, user: Express.User, info) {
    // You can throw an exception based on either "info" or "err" arguments
    console.log('error: ', error);
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
