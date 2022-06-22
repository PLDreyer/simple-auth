import { Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AUTH_MODULE_OPTIONS } from './constants';
import { JwtRefreshService, JwtSessionService } from './jwt/jwt.constants';
import { generate } from 'rand-token';
import {
  AuthListException,
  AuthOptions,
  InternalAuthError,
  InvalidJwtRefresh,
  InvalidTwoFaCode,
} from '@simple-auth/core';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtSessionService)
    private readonly jwtSessionService: JwtService,
    @Inject(JwtRefreshService)
    private readonly jwtRefreshService: JwtService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.authOptions.login.find(username, pass);
  }

  async shouldValidateTwoFa(user: Express.User): Promise<boolean> {
    if (!this.authOptions.login.twoFa) return false;
    return this.authOptions.login.twoFa.shouldValidateTwoFa(user);
  }

  async saveTwoFaSessionToken(
    id: string,
    user: Express.User,
    rememberMe: boolean
  ): Promise<void> {
    return this.authOptions.login?.twoFa?.saveTwoFaSessionToken(
      id,
      user,
      rememberMe
    );
  }

  async validateTwoFaCode(code: string): Promise<boolean> {
    return this.authOptions.login?.twoFa?.validateTwoFaCode(code);
  }

  async login(user: Express.User, req: Request, res: Response) {
    const rememberMe: boolean =
      req.body.rememberMe === undefined ? false : !!req.body.rememberMe;

    if (await this.authOptions.login.twoFa?.shouldValidateTwoFa(req.user)) {
      const twofaToken = generate(32);
      await this.authOptions.login.twoFa?.saveTwoFaSessionToken(
        twofaToken,
        req.user,
        rememberMe
      );
      return {
        success: false,
        info: 'twofa required',
        token: twofaToken,
      };
    }

    const accessToken = await this.applySessionJwtOnRes(user, res, rememberMe);
    const refreshToken = await this.applyRefreshJwtOnRes(user, res, rememberMe);

    if (this.authOptions.session.customResponse) {
      return this.authOptions.session.customResponse(
        req,
        res,
        accessToken,
        refreshToken
      );
    }

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }

  async twoFa(user: Express.User, req: Request, res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const code: string = (user as any)._TWOFA_CODE;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rememberMe: boolean = (user as any)._REMEMBER_ME;

    if (!code) throw new AuthListException([new InternalAuthError()]);

    const isValidToken = await this.authOptions.login.twoFa?.validateTwoFaCode(
      code
    );
    if (!isValidToken) throw new AuthListException([new InvalidTwoFaCode()]);

    const accessToken = await this.applySessionJwtOnRes(user, res, rememberMe);
    const refreshToken = await this.applyRefreshJwtOnRes(user, res, rememberMe);

    if (this.authOptions.login.twoFa?.customResponse) {
      return this.authOptions.login.twoFa.customResponse(
        req,
        res,
        accessToken,
        refreshToken
      );
    }

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }

  async refresh(req: Request, res: Response) {
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _REMEMBER_ME: rememberMe,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _REFRESH_TOKEN: refreshId,
      ...user
    } = req.user;
    if (!refreshId) throw new AuthListException([new InternalAuthError()]);

    await this.authOptions.refresh.delete(refreshId);

    const accessToken = await this.applySessionJwtOnRes(user, res, rememberMe);
    const refreshToken = await this.applyRefreshJwtOnRes(user, res, rememberMe);

    if (this.authOptions.refresh.customResponse) {
      return this.authOptions.refresh.customResponse(
        req,
        res,
        accessToken,
        refreshToken
      );
    }

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }

  async logout(req: Request, res: Response) {
    console.log('NOT_IMPLEMENTED');
  }

  private async applySessionJwtOnRes(
    user: Express.User,
    res: Response,
    rememberMe: boolean
  ): Promise<string> {
    const sessionPayload = { sub: user.id, id: generate(32) };
    await this.authOptions.session.save(sessionPayload.id, user);
    const accessToken = this.jwtSessionService.sign(sessionPayload, {
      secret: this.authOptions.session.secret,
      expiresIn: this.authOptions.session.lifetime,
    });

    res.cookie(this.authOptions.session.cookie.name, accessToken, {
      ...this.authOptions.session.cookie,
      expires: rememberMe
        ? new Date(
            Date.now() + this.authOptions.session.cookie.expires.getTime()
          )
        : undefined,
    });

    return accessToken;
  }

  private async applyRefreshJwtOnRes(
    user: Express.User,
    res: Response,
    rememberMe: boolean
  ): Promise<string> {
    const refreshPayload = { id: generate(32) };
    await this.authOptions.refresh.save(refreshPayload.id, user, rememberMe);
    const refreshToken = this.jwtRefreshService.sign(refreshPayload, {
      secret: this.authOptions.refresh.secret,
      expiresIn: this.authOptions.refresh.lifetime,
    });

    res.cookie(this.authOptions.refresh.cookie.name, refreshToken, {
      ...this.authOptions.refresh.cookie,
      expires: rememberMe
        ? new Date(
            Date.now() + this.authOptions.refresh.cookie.expires.getTime()
          )
        : undefined,
    });

    return refreshToken;
  }
}
