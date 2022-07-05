import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {
  EXPIRED_JWT_REFRESH,
  INTERNAL_AUTH_ERROR,
  INVALID_JWT_REFRESH,
  MALFORMED_JWT_REFRESH,
  MISSING_JWT_REFRESH,
} from '@simple-auth/types';

export const RefreshGuard = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('refresh', (error, user, info) => {
      if (error || info) {
        switch (info) {
          case MISSING_JWT_REFRESH:
          case EXPIRED_JWT_REFRESH:
          case INTERNAL_AUTH_ERROR:
          case MALFORMED_JWT_REFRESH:
          case INVALID_JWT_REFRESH:
            return next(info);
        }
      }

      if (!user) {
        return next(INTERNAL_AUTH_ERROR);
      }

      req.user = user;

      return next();
    })(req, res, next);
  };
};