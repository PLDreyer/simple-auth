import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthError,
  AuthListException,
  ExpiredJwtSession,
  InternalAuthError,
  InvalidApiKey,
  InvalidJwtSession,
  MalformedApiKey,
  MalformedJwtSession,
  MissingJwtSession,
  MultipleApiKeysFound,
} from '../auth.exceptions';
import { AUTH_HANDLER } from '../constants';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

/**
 * Used for all endpoints
 */
@Injectable()
export class GeneralAuthGuard extends AuthGuard(['key', 'jwt']) {
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

  public handleRequest(
    error: null | unknown,
    user: Express.User,
    info: Array<unknown>
  ) {
    if (error || info) {
      const errors = info.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acumm: Array<AuthError>, current: any): Array<AuthError> => {
          if (current instanceof InvalidApiKey) acumm.push(current);

          if (current instanceof MultipleApiKeysFound) acumm.push(current);

          if (current instanceof MalformedApiKey) acumm.push(current);

          if (current instanceof ExpiredJwtSession) acumm.push(current);

          if (current instanceof InvalidJwtSession) acumm.push(current);

          if (current instanceof MissingJwtSession) acumm.push(current);

          if (current instanceof MalformedJwtSession) acumm.push(current);

          return acumm;
        },
        []
      ) as Array<AuthError>;

      if (errors.length === 0) errors.push(new InternalAuthError());

      const exception = new AuthListException(errors);
      if (this.authHandler.options.error)
        return this.authHandler.options.error(exception);

      throw exception;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user as any;
  }
}
