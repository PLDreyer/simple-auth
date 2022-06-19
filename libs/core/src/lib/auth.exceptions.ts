export class AuthError extends Error {}

export class AuthenticationError extends AuthError {}
export class InvalidApiKey extends AuthError {}
export class MissingApiKey extends AuthError {}
export class MissingRefreshToken extends AuthError {}
export class InvalidRefreshToken extends AuthError {}
