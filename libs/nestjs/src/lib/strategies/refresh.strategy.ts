import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AUTH_HANDLER } from '../constants';
import {
  AuthError,
  ExpiredJwtRefresh,
  InternalAuthError,
  InvalidJwtRefresh,
  MalformedJwtRefresh,
  MissingJwtRefresh,
} from '../auth.exceptions';
import { Handler } from '@simple-auth/core';
import {
  EXPIRED_JWT_REFRESH,
  INTERNAL_AUTH_ERROR,
  INVALID_JWT_REFRESH,
  MALFORMED_JWT_REFRESH,
  MISSING_JWT_REFRESH,
} from '@simple-auth/types';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {
    super();
  }

  async validate(
    req: Request
  ): Promise<[Express.User | null, AuthError | null]> {
    const jwt = await this.getJwtFromCookie(req);
    const [user, error] = await this.authHandler.getUserWithRefreshJwt(jwt);

    if (!user) {
      switch (error) {
        case MISSING_JWT_REFRESH:
          return [null, new MissingJwtRefresh()];
        case EXPIRED_JWT_REFRESH:
          return [null, new ExpiredJwtRefresh()];
        case INTERNAL_AUTH_ERROR:
          return [null, new InternalAuthError()];
        case MALFORMED_JWT_REFRESH:
          return [null, new MalformedJwtRefresh()];
        case INVALID_JWT_REFRESH:
          return [null, new InvalidJwtRefresh()];
        default:
          return [null, new InternalAuthError()];
      }
    }

    return [user, null];
  }

  private async getJwtFromCookie(req: Request): Promise<string | null> {
    const cookieName = this.authHandler.options.refresh.cookie.name;
    let cookie = this.authHandler.options.refresh.cookie.signed
      ? req.signedCookies[cookieName]
      : req.cookies[cookieName];

    if (!cookie) {
      cookie = this.authHandler.options.refresh.cookie.signed
        ? req.cookies[cookieName]
        : req.signedCookies[cookieName];
    }

    if (!cookie) return null;

    return cookie;
  }
}
