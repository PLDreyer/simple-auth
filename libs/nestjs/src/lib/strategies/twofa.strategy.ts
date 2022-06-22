import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import {
  AuthError,
  AuthOptions,
  InvalidTwoFaToken,
  MissingTwoFaCode,
  MissingTwoFaToken,
  TwoFaCode,
} from '@simple-auth/core';
import { AUTH_MODULE_OPTIONS } from '../constants';

@Injectable()
export class TwofaStrategy extends PassportStrategy(Strategy, 'twofa') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>
  ) {
    super();
  }

  async validate(
    req: Request
  ): Promise<[Express.User | null, AuthError | null]> {
    const token = req.body.token;
    if (!token) return [null, new MissingTwoFaToken()];

    const code = req.body.code;
    if (!code) return [null, new MissingTwoFaCode()];

    const user = await this.authOptions.login.twoFa?.findTwoFaSessionToken(
      token
    );
    if (!user) return [null, new InvalidTwoFaToken()];

    return [
      {
        ...user.user,
        _TWOFA_CODE: new TwoFaCode(code),
        _REMEMBER_ME: user.rememberMe,
      } as Express.User,
      null,
    ];
  }
}
