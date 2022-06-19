export class AuthError extends Error {}

export class AuthenticationError extends AuthError {}

export class UserError extends AuthenticationError {}
export class InvalidUser extends UserError {}
export class MissingUser extends UserError {}

export class ApiKeyError extends AuthenticationError {}
export class InvalidApiKey extends ApiKeyError {}
export class MissingApiKey extends ApiKeyError {}
export class MultipleApiKeysFound extends ApiKeyError {}
export class MalformedApiKey extends ApiKeyError {}

export class JwtSessionError extends AuthenticationError {}
export class InvalidJwtSession extends JwtSessionError {}
export class MissingJwtSession extends JwtSessionError {}
export class MalformedJwtSession extends JwtSessionError {}

export class JwtRefreshError extends AuthenticationError {}
export class InvalidJwtRefresh extends JwtRefreshError {}
export class MissingJwtRefresh extends JwtRefreshError {}
export class MalformedJwtRefresh extends JwtRefreshError {}

