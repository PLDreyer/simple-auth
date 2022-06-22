import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthError, AuthOptions } from '@simple-auth/core';
import { AUTH_MODULE_OPTIONS } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  public handleRequest(
    error: unknown,
    user: Express.User,
    info: AuthError,
    _ctx: ExecutionContext,
    _status: unknown
  ) {
    console.log('error: ', error);
    console.log('user: ', user);
    console.log('info: ', info);
    if (error || info) {
      if (this.authOptions.error) return this.authOptions.error(info);
      throw info;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
