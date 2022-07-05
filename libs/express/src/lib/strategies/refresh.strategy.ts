import type { Request } from 'express';
import type { StrategyCallback } from '../constants';
import { Strategy } from 'passport-custom';
import { extractHandler, extractJwtFromCookie } from '../utils';
import {
  EXPIRED_JWT_REFRESH,
  INTERNAL_AUTH_ERROR,
  INVALID_JWT_REFRESH,
  MALFORMED_JWT_REFRESH,
  MISSING_JWT_REFRESH,
} from '@simple-auth/types';

export const RefreshStrategy = new Strategy(
  async (req: Request, done: StrategyCallback) => {
    const handler = extractHandler(req.app);
    const jwt = extractJwtFromCookie(
      req,
      handler.options.refresh.cookie.name,
      handler.options.refresh.cookie.signed
    );

    const [user, error] = await handler.getUserWithRefreshJwt(jwt);
    if (!user) {
      switch (error) {
        case MISSING_JWT_REFRESH:
        case EXPIRED_JWT_REFRESH:
        case MALFORMED_JWT_REFRESH:
        case INVALID_JWT_REFRESH:
          return done(null, null, error);
        default:
          return done(null, null, INTERNAL_AUTH_ERROR);
      }
    }

    return done(null, user, null);
  }
);
