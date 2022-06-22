import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthError, AuthListException, AuthOptions } from '@simple-auth/core';
import { AUTH_MODULE_OPTIONS } from '../constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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
    // You can throw an exception based on either "info" or "err" arguments
    if (error || info) {
      const exception = new AuthListException([info]);
      if (this.authOptions.error) return this.authOptions.error(exception);
      throw exception;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
