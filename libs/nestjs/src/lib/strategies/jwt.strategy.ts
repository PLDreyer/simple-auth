import type { Handler } from '@simple-auth/core';
import type { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH_HANDLER } from '../constants';
import {
  EXPIRED_JWT_SESSION,
  INTERNAL_AUTH_ERROR,
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
  async validate(req: Request): Promise<[Express.User | null, string | null]> {
    const [jwt, jwtError] = await this.getJwtFromCookie(req);
    if (!jwtError) return [null, jwtError];

    const [user, error] = await this.authHandler.getUserWithSessionJwt(jwt);

    if (!user) {
      switch (error) {
        case MISSING_JWT_SESSION:
          return [null, MISSING_JWT_SESSION];
        case EXPIRED_JWT_SESSION:
          return [null, EXPIRED_JWT_SESSION];
        case INVALID_JWT_SESSION:
          return [null, INVALID_JWT_SESSION];
        case MALFORMED_JWT_SESSION:
          return [null, MALFORMED_JWT_SESSION];
        default:
          return [null, INTERNAL_AUTH_ERROR];
      }
    }

    return [user, null];
  }

  private async getJwtFromCookie(
    req: Request
  ): Promise<[string | null, string | null]> {
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
      return [null, INVALID_JWT_SESSION];
    }

    if (!cookie) return [null, null];

    return [cookie, null];
  }
}
