import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { extractHandler, extractJwtFromCookie } from '../utils';
import {
  EXPIRED_JWT_REFRESH,
  INTERNAL_AUTH_ERROR,
  INVALID_JWT_REFRESH,
  MALFORMED_JWT_REFRESH,
  MISSING_JWT_REFRESH,
} from '@simple-auth/types';

export const RefreshStrategy = new Strategy(async (req: Request, done: any) => {
  const handler = extractHandler(req.app);
  const jwt = extractJwtFromCookie(
    req,
    handler.options.refresh.cookie.name,
    handler.options.refresh.cookie.signed
  );

  const [user, error] = await handler.getUserWithRefreshJwt(jwt);
  // TODO implement error handling
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

  return done(null, user);
});
