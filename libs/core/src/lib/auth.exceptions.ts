import { HttpException } from '@nestjs/common';
import {
  EXPIRED_JWT_REFRESH,
  EXPIRED_JWT_SESSION,
  EXPIRED_TWOFA_TOKEN,
  INTERNAL_AUTH_ERROR,
  INVALID_API_KEY,
  INVALID_JWT_REFRESH,
  INVALID_JWT_SESSION,
  INVALID_TWOFA_CODE,
  INVALID_TWOFA_TOKEN,
  INVALID_USER_CREDENTIALS,
  MALFORMED_API_KEY,
  MALFORMED_JWT_REFRESH,
  MALFORMED_JWT_SESSION,
  MALFORMED_TWOFA_TOKEN,
  MISSING_API_KEY,
  MISSING_JWT_REFRESH,
  MISSING_JWT_SESSION,
  MISSING_TWOFA_CODE,
  MISSING_TWOFA_TOKEN,
  MISSING_USER,
  MULTIPLE_API_KEYS_FOUND,
} from './messages.exceptions';
import { TwoFaCode } from './miscellaneous';

/**
 * Printable auth errors
 */
export class AuthError extends HttpException {}

/**
 * Wrapper
 */
export class AuthenticationError extends AuthError {}

/**
 * Auth error collection
 */
export class AuthListException extends AuthenticationError {
  constructor(errors: Array<AuthError>) {
    super(
      {
        errors,
      },
      401
    );
  }
}

/**
 * Uncaught errors
 */
export class InternalAuthError extends AuthenticationError {
  constructor() {
    super(
      {
        error: INTERNAL_AUTH_ERROR,
      },
      500
    );
  }
}

/**
 * User errors
 */
export class UserError extends AuthenticationError {}
export class InvalidUserCredentials extends UserError {
  constructor() {
    super(
      {
        error: INVALID_USER_CREDENTIALS,
      },
      400
    );
  }
}
export class MissingUser extends UserError {
  constructor() {
    super(
      {
        error: MISSING_USER,
      },
      404
    );
  }
}

/**
 * Apikey errors
 */
export class ApiKeyError extends AuthenticationError {}
export class InvalidApiKey extends ApiKeyError {
  constructor() {
    super(
      {
        error: INVALID_API_KEY,
      },
      400
    );
  }
}
export class MissingApiKey extends ApiKeyError {
  constructor() {
    super(
      {
        code: MISSING_API_KEY,
      },
      400
    );
  }
}
export class MultipleApiKeysFound extends ApiKeyError {
  constructor() {
    super(
      {
        error: MULTIPLE_API_KEYS_FOUND,
      },
      400
    );
  }
}
export class MalformedApiKey extends ApiKeyError {
  constructor() {
    super(
      {
        error: MALFORMED_API_KEY,
      },
      400
    );
  }
}

/**
 * Session errors
 */
export class JwtSessionError extends AuthenticationError {}
export class InvalidJwtSession extends JwtSessionError {
  constructor() {
    super(
      {
        error: INVALID_JWT_SESSION,
      },
      400
    );
  }
}
export class MissingJwtSession extends JwtSessionError {
  constructor() {
    super(
      {
        error: MISSING_JWT_SESSION,
      },
      400
    );
  }
}
export class MalformedJwtSession extends JwtSessionError {
  constructor() {
    super(
      {
        error: MALFORMED_JWT_SESSION,
      },
      400
    );
  }
}
export class ExpiredJwtSession extends JwtSessionError {
  constructor() {
    super(
      {
        error: EXPIRED_JWT_SESSION,
      },
      400
    );
  }
}

/**
 * Refresh errors
 */
export class JwtRefreshError extends AuthenticationError {}
export class InvalidJwtRefresh extends JwtRefreshError {
  constructor() {
    super(
      {
        error: INVALID_JWT_REFRESH,
      },
      400
    );
  }
}
export class MissingJwtRefresh extends JwtRefreshError {
  constructor() {
    super(
      {
        error: MISSING_JWT_REFRESH,
      },
      400
    );
  }
}
export class MalformedJwtRefresh extends JwtRefreshError {
  constructor() {
    super(
      {
        error: MALFORMED_JWT_REFRESH,
      },
      400
    );
  }
}
export class ExpiredJwtRefresh extends JwtRefreshError {
  constructor() {
    super(
      {
        error: EXPIRED_JWT_REFRESH,
      },
      400
    );
  }
}

/**
 * TwoFa errors
 */
export class TwoFaError extends AuthenticationError {}
export class InvalidTwoFaToken extends TwoFaError {
  constructor() {
    super(
      {
        error: INVALID_TWOFA_TOKEN,
      },
      400
    );
  }
}
export class InvalidTwoFaCode extends TwoFaError {
  constructor() {
    super(
      {
        error: INVALID_TWOFA_CODE,
      },
      400
    );
  }
}
export class MissingTwoFaToken extends TwoFaError {
  constructor() {
    super(
      {
        error: MISSING_TWOFA_TOKEN,
      },
      400
    );
  }
}
export class MissingTwoFaCode extends TwoFaError {
  constructor() {
    super(
      {
        error: MISSING_TWOFA_CODE,
      },
      400
    );
  }
}
export class MalformedTwoFaToken extends TwoFaError {
  constructor() {
    super(
      {
        error: MALFORMED_TWOFA_TOKEN,
      },
      400
    );
  }
}
export class ExpiredTwoFaToken extends TwoFaError {
  constructor() {
    super(
      {
        error: EXPIRED_TWOFA_TOKEN,
      },
      400
    );
  }
}
