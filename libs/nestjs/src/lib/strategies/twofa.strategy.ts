import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  InternalAuthError,
  InvalidTwoFaCode,
  InvalidTwoFaToken,
  MissingTwoFaCode,
  MissingTwoFaToken,
} from '../auth.exceptions';
import { AUTH_HANDLER } from '../constants';
import { Handler } from '@simple-auth/core';
import {
  INVALID_TWOFA_CODE,
  INVALID_TWOFA_TOKEN,
  MISSING_TWOFA_CODE,
  MISSING_TWOFA_TOKEN,
} from '@simple-auth/types';

@Injectable()
export class TwofaStrategy extends PassportStrategy(Strategy, 'twofa') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {
    super();
  }

  async validate(req: Request) {
    const [user, error] = await this.authHandler.getUserWithTwoFa(req.body);

    if (!user) {
      switch (error) {
        case MISSING_TWOFA_TOKEN:
          return [null, new MissingTwoFaToken()];
        case MISSING_TWOFA_CODE:
          return [null, new MissingTwoFaCode()];
        case INVALID_TWOFA_CODE:
          return [null, new InvalidTwoFaCode()];
        case INVALID_TWOFA_TOKEN:
          return [null, new InvalidTwoFaToken()];
        default:
          return [null, new InternalAuthError()];
      }
    }

    return [user, null];
  }
}
