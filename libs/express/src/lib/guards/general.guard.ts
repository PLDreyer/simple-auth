import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {
  EXPIRED_JWT_SESSION,
  INTERNAL_AUTH_ERROR,
  INVALID_API_KEY,
  INVALID_JWT_SESSION,
  MALFORMED_API_KEY,
  MALFORMED_JWT_SESSION,
  MISSING_JWT_SESSION,
  MULTIPLE_API_KEYS_FOUND,
  SimpleAuthError,
} from '@simple-auth/types';

export const GeneralGuard = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(['key', 'session'], (err, user, info) => {
      if (err || info) {
        for (const error of info) {
          switch (error) {
            case MALFORMED_API_KEY:
            case INVALID_API_KEY:
            case MULTIPLE_API_KEYS_FOUND:
            case INVALID_JWT_SESSION:
            case MALFORMED_JWT_SESSION:
            case MISSING_JWT_SESSION:
            case EXPIRED_JWT_SESSION:
              return next(new SimpleAuthError(error));
          }
        }

        return next(
          new SimpleAuthError(
            INTERNAL_AUTH_ERROR,
            new Error('Unhandled switch case: ' + info.join(','))
          )
        );
      }

      if (!user) {
        return next(
          new SimpleAuthError(
            INTERNAL_AUTH_ERROR,
            new Error('Unhandled switch case: ' + info.join(','))
          )
        );
      }

      req.user = user;

      return next();
    })(req, res, next);
  };
};
