import { Strategy } from 'passport-custom';
import type { Request } from 'express';
import type { StrategyCallback } from '../constants';
import { extractHandler, extractJwtFromCookie } from '../utils';
import {
  EXPIRED_JWT_SESSION,
  INTERNAL_AUTH_ERROR,
  INVALID_JWT_SESSION,
  MALFORMED_JWT_SESSION,
  MISSING_JWT_SESSION,
} from '@simple-auth/types';

export const SessionStrategy = new Strategy(
  async (req: Request, done: StrategyCallback) => {
    const handler = extractHandler(req.app);
    const jwt = extractJwtFromCookie(
      req,
      handler.options.session.cookie.name,
      handler.options.session.cookie.signed
    );
    const [user, error] = await handler.getUserWithSessionJwt(jwt);
    if (!user) {
      switch (error) {
        case MISSING_JWT_SESSION:
        case EXPIRED_JWT_SESSION:
        case MALFORMED_JWT_SESSION:
        case INVALID_JWT_SESSION:
          return done(null, null, error);
        default:
          return done(null, null, INTERNAL_AUTH_ERROR);
      }
    }

    return done(null, user, null);
  }
);
