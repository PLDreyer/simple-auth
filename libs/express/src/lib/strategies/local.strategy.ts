import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { extractHandler } from '../utils';
import {
  INTERNAL_AUTH_ERROR,
  INVALID_USER_CREDENTIALS,
  MISSING_USER_CREDENTIALS,
} from '@simple-auth/types';

export const LocalStrategy = new Strategy(async (req: Request, done: any) => {
  const handler = extractHandler(req.app);
  const [user, error] = await handler.getUserWithCredentials(req.body);

  if (!user) {
    switch (error) {
      case MISSING_USER_CREDENTIALS:
      case INVALID_USER_CREDENTIALS:
        return done(null, null, error);
      default:
        return done(null, null, INTERNAL_AUTH_ERROR);
    }
  }

  return done(null, user, null);
});
