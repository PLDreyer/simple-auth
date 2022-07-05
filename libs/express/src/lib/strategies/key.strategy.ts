import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { extractApiKey, extractHandler } from '../utils';
import {
  INTERNAL_AUTH_ERROR,
  INVALID_API_KEY,
  MALFORMED_API_KEY,
  MISSING_API_KEY,
  MULTIPLE_API_KEYS_FOUND,
} from '@simple-auth/types';

export const KeyStrategy = new Strategy(async (req: Request, done: any) => {
  const handler = extractHandler(req.app);
  const [key, keyError] = extractApiKey(req, handler.options.apiKey);

  if (!key) {
    switch (keyError) {
      case MULTIPLE_API_KEYS_FOUND:
      case MALFORMED_API_KEY:
      case MISSING_API_KEY:
        return done(null, null, keyError);
      default:
        return done(null, null, INTERNAL_AUTH_ERROR);
    }
  }

  const [user, error] = await handler.getUserWithApiKey(key);
  if (!user) {
    switch (error) {
      case MISSING_API_KEY:
      case INVALID_API_KEY:
        return done(null, null, error);
      default:
        return done(null, null, INTERNAL_AUTH_ERROR);
    }
  }

  return done(null, user, null);
});
