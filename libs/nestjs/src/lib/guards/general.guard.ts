import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthError,
  AuthListException,
  AuthOptions,
  ExpiredJwtSession,
  InternalAuthError,
  InvalidApiKey,
  InvalidUserCredentials,
} from '@simple-auth/core';
import { AUTH_MODULE_OPTIONS } from '../constants';

/**
 * Used for all endpoints
 */
@Injectable()
export class GeneralAuthGuard extends AuthGuard(['key', 'jwt']) {
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
    error: null | unknown,
    user: Express.User,
    info: Array<unknown>
  ) {
    if (error || info) {
      console.log('error: ', error);
      console.log('info: ', info);
      const errors = info.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acumm: Array<AuthError>, current: any): Array<AuthError> => {
          if (current instanceof InvalidApiKey) acumm.push(current);

          if (current instanceof ExpiredJwtSession) acumm.push(current);

          if (current instanceof InvalidUserCredentials) acumm.push(current);

          return acumm;
        },
        []
      ) as Array<AuthError>;

      if (errors.length === 0) errors.push(new InternalAuthError());

      const exception = new AuthListException(errors);
      if (this.authOptions.error) return this.authOptions.error(exception);

      throw exception;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
