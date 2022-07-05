import { SessionOptions } from './session';
import { ApiKeyOptions } from './apikey';
import { RefreshOptions } from './refresh';
import { LoginOptions } from './login';
import { ParserOptions } from './parser';

export const DEFAULT_USERNAME_FIELD = 'username';
export const DEFAULT_PASSWORD_FIELD = 'password';

/**
 * AuthModule options
 */
export type AuthOptions<U, I, R> = {
  /**
   * Options for api key
   * To disable api key handling skip configuration
   */
  apiKey?: ApiKeyOptions<U, I>;
  /**
   * Options for login
   */
  login: LoginOptions<U, I, R>;
  /**
   * Options for sessions
   */
  session: SessionOptions<U, I, R>;
  /**
   * Options for refresh
   */
  refresh: RefreshOptions<U, I, R>;
  /**
   * Options for parser
   */
  parser: ParserOptions;
  /**
   * Error handler
   * @param errors AuthListException
   */
  error?: (errors: unknown) => Promise<never>;
};
