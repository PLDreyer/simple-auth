import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AUTH_MODULE_OPTIONS } from '../constants';
import {
  AuthError,
  AuthOptions,
  ExpiredJwtRefresh,
  InternalAuthError,
  InvalidJwtRefresh,
  MalformedJwtRefresh,
  MissingJwtRefresh,
} from '@simple-auth/core';
import { JwtRefreshService } from '../jwt/jwt.constants';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>,
    @Inject(JwtRefreshService)
    private readonly jwtService: JwtService
  ) {
    super();
  }

  async validate(
    req: Request
  ): Promise<[Express.User | null, AuthError | null]> {
    const jwt = await this.getJwtFromCookie(req);
    if (!jwt) return [null, new MissingJwtRefresh()];

    const [payload, error] = await this.getJwtPayload(jwt);
    if (error) return [null, error];

    if (!payload.id) return [null, new InvalidJwtRefresh()];

    if (typeof payload.id !== 'string')
      return [null, new MalformedJwtRefresh()];

    const user = await this.authOptions.refresh.find(payload.id);
    if (!user) return [null, new InvalidJwtRefresh()];

    return [
      {
        ...user.user,
        _REFRESH_TOKEN: payload.id,
        _REMEMBER_ME: user.rememberMe,
      } as Express.User,
      null,
    ];
  }

  private async getJwtFromCookie(req: Request): Promise<string | null> {
    const cookieName = this.authOptions.refresh.cookie.name;
    let cookie = this.authOptions.refresh.cookie.signed
      ? req.signedCookies[cookieName]
      : req.cookies[cookieName];

    if (!cookie) {
      cookie = this.authOptions.refresh.cookie.signed
        ? req.cookies[cookieName]
        : req.signedCookies[cookieName];
    }

    if (!cookie) return null;

    return cookie;
  }

  private async getJwtPayload(
    jwt: string
  ): Promise<[Record<string, unknown> | null, AuthError | null]> {
    let payload;

    try {
      payload = await this.jwtService.verify(jwt, {
        secret: this.authOptions.refresh.secret,
        ignoreExpiration: false,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError)
        return [null, new ExpiredJwtRefresh()];

      return [null, new InternalAuthError()];
    }

    return [payload, null];
  }
}
