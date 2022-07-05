import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {
  INTERNAL_AUTH_ERROR,
  INVALID_USER_CREDENTIALS,
  MISSING_USER_CREDENTIALS,
} from '@simple-auth/types';

export const LocalGuard = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (error, user, info) => {
      if (error || info) {
        switch (info) {
          case MISSING_USER_CREDENTIALS:
          case INVALID_USER_CREDENTIALS:
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
