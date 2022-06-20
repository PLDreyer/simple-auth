import {HttpException} from "@nestjs/common";
import {
  EXPIRED_JWT_REFRESH,
  EXPIRED_JWT_SESSION,
  INTERNAL_AUTH_ERROR,
  INVALID_API_KEY, INVALID_JWT_REFRESH, INVALID_JWT_SESSION,
  INVALID_USER_CREDENTIALS, MALFORMED_API_KEY, MALFORMED_JWT_REFRESH, MALFORMED_JWT_SESSION,
  MISSING_API_KEY, MISSING_JWT_REFRESH, MISSING_JWT_SESSION,
  MISSING_USER,
  MULTIPLE_API_KEYS_FOUND
} from "./messages.exceptions";

export class AuthError extends HttpException {}
export class AuthenticationError extends AuthError {}

export class AuthListException extends AuthenticationError {
  constructor(errors: Array<AuthError>) {
    super({
      errors,
    }, 401);
  }
}

export class InternalAuthError extends AuthenticationError {
  constructor() {
    super({
      error: INTERNAL_AUTH_ERROR,
    }, 500);
  }
}

export class UserError extends AuthenticationError {}
export class InvalidUserCredentials extends UserError {
  constructor() {
    super({
      error: INVALID_USER_CREDENTIALS,
    }, 400);
  }

}
export class MissingUser extends UserError {
  constructor() {
    super({
      error: MISSING_USER,
    }, 404);
  }
}

export class ApiKeyError extends AuthenticationError {}
export class InvalidApiKey extends ApiKeyError {
  constructor() {
    super({
      error: INVALID_API_KEY,
    }, 400);
  }
}

export class MissingApiKey extends ApiKeyError {
  constructor() {
    super({
      code: MISSING_API_KEY,
    }, 400);
  }
}

export class MultipleApiKeysFound extends ApiKeyError {
  constructor() {
    super({
      error: MULTIPLE_API_KEYS_FOUND,
    }, 400);
  }
}

export class MalformedApiKey extends ApiKeyError {
  constructor() {
    super({
      error: MALFORMED_API_KEY,
    }, 400);
  }
}

export class JwtSessionError extends AuthenticationError {}
export class InvalidJwtSession extends JwtSessionError {
  constructor() {
    super({
      error: INVALID_JWT_SESSION,
    }, 400);
  }
}
export class MissingJwtSession extends JwtSessionError {
  constructor() {
    super({
      error: MISSING_JWT_SESSION,
    }, 400);
  }
}
export class MalformedJwtSession extends JwtSessionError {
  constructor() {
    super({
      error: MALFORMED_JWT_SESSION,
    }, 400);
  }
}
export class ExpiredJwtSession extends JwtSessionError {
  constructor() {
    super({
      error: EXPIRED_JWT_SESSION,
    }, 400);
  }
}

export class JwtRefreshError extends AuthenticationError {}
export class InvalidJwtRefresh extends JwtRefreshError {
  constructor() {
    super({
      error: INVALID_JWT_REFRESH,
    }, 400);
  }
}
export class MissingJwtRefresh extends JwtRefreshError {
  constructor() {
    super({
      error: MISSING_JWT_REFRESH,
    }, 400);
  }
}
export class MalformedJwtRefresh extends JwtRefreshError {
  constructor() {
    super({
      error: MALFORMED_JWT_REFRESH,
    }, 400);
  }
}
export class ExpiredJwtRefresh extends JwtRefreshError {
  constructor() {
    super({
      error: EXPIRED_JWT_REFRESH,
    }, 400);
  }
}

