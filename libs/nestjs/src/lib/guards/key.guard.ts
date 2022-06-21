import {
  ExecutionContext,
  Inject,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_MODULE_OPTIONS } from '../constants';
import { AuthError, AuthOptions } from '@simple-auth/core';

@Injectable()
export class KeyAuthGuard extends AuthGuard('key') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions
  ) {
    super();
  }

  public handleRequest(
    error: unknown,
    user: Express.User,
    info: AuthError,
    ctx: ExecutionContext,
    status: unknown
  ): any {
    // You can throw an exception based on either "info" or "err" arguments
    console.log('error: ', error);
    console.log('info: ', info);
    if (error || info) {
      if (this.authOptions.error) return this.authOptions.error(info);
      throw info;
    }

    return user as any;
  }
}
