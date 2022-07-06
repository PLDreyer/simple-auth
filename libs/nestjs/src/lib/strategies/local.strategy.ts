import type { Request, Response } from 'express';
import type { Handler } from '@simple-auth/core';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AUTH_HANDLER } from '../constants';
import {
  INTERNAL_AUTH_ERROR,
  INVALID_USER_CREDENTIALS,
  MISSING_USER_CREDENTIALS,
} from '@simple-auth/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {
    super();
  }

  async validate(req: Request) {
    const [user, error] = await this.authHandler.getUserWithCredentials(
      req.body
    );

    if (!user) {
      switch (error) {
        case MISSING_USER_CREDENTIALS:
        case INVALID_USER_CREDENTIALS:
          return [null, error];
      }

      return [null, INTERNAL_AUTH_ERROR];
    }

    return [user, null];
  }
}
