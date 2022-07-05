import passport from 'passport';
import {
  EXPIRED_TWOFA_TOKEN,
  INTERNAL_AUTH_ERROR,
  INVALID_TWOFA_CODE,
  INVALID_TWOFA_TOKEN,
  MALFORMED_TWOFA_TOKEN,
  MISSING_TWOFA_CODE,
  MISSING_TWOFA_TOKEN,
} from '@simple-auth/types';

export const TwofaGuard = () => {
  return (req, res, next) => {
    passport.authenticate('twofa', (error, user, info) => {
      if (error || info) {
        switch (info) {
          case MISSING_TWOFA_TOKEN:
          case MISSING_TWOFA_CODE:
          case INVALID_TWOFA_TOKEN:
          case INVALID_TWOFA_CODE:
          case EXPIRED_TWOFA_TOKEN:
          case MALFORMED_TWOFA_TOKEN:
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
