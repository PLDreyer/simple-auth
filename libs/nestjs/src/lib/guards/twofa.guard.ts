import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthError, AuthListException, AuthOptions } from '@simple-auth/core';
import { AUTH_MODULE_OPTIONS } from '../constants';

@Injectable()
export class TwoFaAuthGuard extends AuthGuard(['twofa']) {
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

  public handleRequest(error, user, info: AuthError) {
    if (error || info) {
      const exception = new AuthListException([info]);
      if (this.authOptions.error) return this.authOptions.error(exception);
      throw exception;
    }

    return user;
  }
}
