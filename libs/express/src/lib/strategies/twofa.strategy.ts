import type { Request } from 'express';
import type { StrategyCallback } from '../constants';
import { Strategy } from 'passport-custom';
import { extractHandler } from '../utils';
import {
  INTERNAL_AUTH_ERROR,
  INVALID_TWOFA_CODE,
  INVALID_TWOFA_TOKEN,
  MISSING_TWOFA_CODE,
  MISSING_TWOFA_TOKEN,
} from '@simple-auth/types';

export const TwofaStrategy = new Strategy(
  async (req: Request, done: StrategyCallback) => {
    const handler = extractHandler(req.app);
    const [user, error] = await handler.getUserWithTwoFa(req.body);

    if (!user) {
      switch (error) {
        case MISSING_TWOFA_TOKEN:
        case MISSING_TWOFA_CODE:
        case INVALID_TWOFA_TOKEN:
        case INVALID_TWOFA_CODE:
          return done(null, null, error);
        default:
          return done(null, null, INTERNAL_AUTH_ERROR);
      }
    }

    return done(null, user, null);
  }
);
