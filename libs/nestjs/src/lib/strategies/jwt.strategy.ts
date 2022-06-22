import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AUTH_MODULE_OPTIONS } from '../constants';
import {
  AuthError,
  AuthOptions,
  ExpiredJwtSession,
  InternalAuthError,
  InvalidJwtSession,
  MalformedJwtSession,
  MissingJwtSession,
} from '@simple-auth/core';
import { JwtSessionService } from '../jwt/jwt.constants';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>,
    @Inject(JwtSessionService)
    private readonly jwtService: JwtService
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
    const jwt = await this.getJwtFromCookie(req);
    if (!jwt) return [null, new MissingJwtSession()];

    const [payload, error] = await this.getJwtPayload(jwt);
    if (error) return [null, error];

    if (!payload.id) return [null, new InvalidJwtSession()];

    if (typeof payload.id !== 'string')
      return [null, new MalformedJwtSession()];

    const user = await this.authOptions.session.find(payload.id);
    if (!user) return [null, new InvalidJwtSession()];

    return [user, null];
  }

  private async getJwtFromCookie(req: Request): Promise<string | null> {
    console.log('req.cookies: ', req.cookies);
    console.log('req.signedCookies: ', req.signedCookies);
    const cookieName = this.authOptions.session.cookie.name;
    let cookie = this.authOptions.session.cookie.signed
      ? req.signedCookies[cookieName]
      : req.cookies[cookieName];

    if (!cookie) {
      cookie = this.authOptions.session.cookie.signed
        ? req.cookies[cookieName]
        : req.signedCookies[cookieName];
    }

    console.log('cookie: ', cookie);

    if (!cookie) return null;

    return cookie;
  }

  private async getJwtPayload(
    jwt: string
  ): Promise<[Record<string, unknown> | null, AuthError | null]> {
    let payload;

    try {
      payload = await this.jwtService.verify(jwt, {
        secret: this.authOptions.session.secret,
        ignoreExpiration: false,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError)
        return [null, new ExpiredJwtSession()];

      return [null, new InternalAuthError()];
    }

    return [payload, null];
  }
}
