import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AUTH_HANDLER } from '../constants';
import {
  AuthError,
  ExpiredJwtSession,
  InternalAuthError,
  InvalidJwtSession,
  MalformedJwtSession,
  MissingJwtSession,
} from '../auth.exceptions';
import { Handler } from '@simple-auth/core';
import {
  EXPIRED_JWT_SESSION,
  INVALID_JWT_SESSION,
  MALFORMED_JWT_SESSION,
  MISSING_JWT_SESSION,
} from '@simple-auth/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {
    super();
  }

  /**
   * @param req
   * @returns user, info, status
   */
  async validate(
    req: Request
  ): Promise<[Express.User | null, AuthError | null]> {
    const [jwt, jwtError] = await this.getJwtFromCookie(req);
    if (!jwtError) return [null, new InvalidJwtSession()];

    const [user, error] = await this.authHandler.getUserWithSessionJwt(jwt);

    if (!user) {
      switch (error) {
        case MISSING_JWT_SESSION:
          return [null, new MissingJwtSession()];
        case EXPIRED_JWT_SESSION:
          return [null, new ExpiredJwtSession()];
        case INVALID_JWT_SESSION:
          return [null, new InvalidJwtSession()];
        case MALFORMED_JWT_SESSION:
          return [null, new MalformedJwtSession()];
        default:
          return [null, new InternalAuthError()];
      }
    }

    return [user, null];
  }

  private async getJwtFromCookie(
    req: Request
  ): Promise<[string | null, AuthError | null]> {
    const cookieName = this.authHandler.options.session.cookie.name;
    let cookie = this.authHandler.options.session.cookie.signed
      ? req.signedCookies[cookieName]
      : req.cookies[cookieName];

    if (!cookie) {
      cookie = this.authHandler.options.session.cookie.signed
        ? req.cookies[cookieName]
        : req.signedCookies[cookieName];
    }

    if (cookie === false && this.authHandler.options.session.cookie.signed) {
      return [null, new InvalidJwtSession()];
    }

    if (!cookie) return [null, null];

    return [cookie, null];
  }
}
