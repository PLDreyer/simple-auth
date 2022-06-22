import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_MODULE_OPTIONS } from '../constants';
import { AuthError, AuthOptions } from '@simple-auth/core';

@Injectable()
export class KeyAuthGuard extends AuthGuard('key') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>
  ) {
    super();
  }

  public handleRequest(
    error: unknown,
    user: Express.User,
    info: AuthError,
    _ctx: ExecutionContext,
    _status: unknown
  ) {
    // You can throw an exception based on either "info" or "err" arguments
    console.log('error: ', error);
    console.log('info: ', info);
    if (error || info) {
      if (this.authOptions.error) return this.authOptions.error(info);
      throw info;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
