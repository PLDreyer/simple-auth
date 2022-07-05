import passport from 'passport';
import {
  EXPIRED_JWT_SESSION, INTERNAL_AUTH_ERROR,
  INVALID_API_KEY,
  INVALID_JWT_SESSION,
  MALFORMED_API_KEY,
  MALFORMED_JWT_SESSION,
  MISSING_JWT_SESSION,
  MULTIPLE_API_KEYS_FOUND,
} from '@simple-auth/types';

export const GeneralGuard = () => {
  return (req, res, next) => {
    passport.authenticate(['key', 'session'], (err, user, info) => {
      if (err || info) {
        info.forEach((error) => {
          switch (error) {
            case MALFORMED_API_KEY:
            case INVALID_API_KEY:
            case MULTIPLE_API_KEYS_FOUND:
            case INVALID_JWT_SESSION:
            case MALFORMED_JWT_SESSION:
            case MISSING_JWT_SESSION:
            case EXPIRED_JWT_SESSION:
              return next(error);
          }
        });

        return next(INTERNAL_AUTH_ERROR);
      }

      if (!user) {
        return next(INTERNAL_AUTH_ERROR);
      }

      req.user = user;

      return next();
    })(req, res, next);
  };
};
