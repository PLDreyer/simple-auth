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
export class MissingUserCredentials extends UserError {
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

/**
 * Invalid api key (wrong format/type)
 */
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

/**
 * Missing api key
 */
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

/**
 * Multiple api keys found
 */
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

/**
 * Malformed api key
 */
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

/**
 * Invalid jwt session (wrong format/type)
 */
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

/**
 * Missing jwt session/cookie
 */
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

/**
 * Malformed jwt session
 */
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

/**
 * Expired jwt session
 */
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

/**
 * Invalid jwt refresh (wrong format/type)
 */
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

/**
 * Missing jwt refresh/cookie
 */
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

/**
 * Malformed jwt refresh
 */
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

/**
 * Expired jwt refresh
 */
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

/**
 * Invalid 2fa token (wrong format/type)
 */
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

/**
 * Invalid 2fa code (wrong format/type)
 */
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

/**
 * Missing 2fa token
 */
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

/**
 * Missing 2fa code
 */
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

/**
 * Malformed 2fa token
 */
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

/**
 * Expired 2fa token
 */
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
