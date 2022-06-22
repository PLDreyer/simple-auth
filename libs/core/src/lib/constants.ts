import { AuthListException } from './auth.exceptions';
import { SessionOptions } from './session';
import { ApiKeyOptions } from './apikey';
import { RefreshOptions } from './refresh';
import { LoginOptions } from './login';
import { ParserOptions } from './parser';

// TODO declare global express needed ?
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {}
  }
}

/**
 * AuthModule options
 */
export type AuthOptions<U> = {
  /**
   * Options for api key
   * To disable api key handling skip configuration
   */
  apiKey?: ApiKeyOptions<U>;
  /**
   * Options for login
   */
  login: LoginOptions<U>;
  /**
   * Options for sessions
   */
  session: SessionOptions<U>;
  /**
   * Options for refresh
   */
  refresh: RefreshOptions<U>;
  /**
   * Options for parser
   */
  parser: ParserOptions;
  /**
   * Error handler
   * @param errors AuthListException
   */
  error?: (errors: AuthListException) => Promise<never>;
};
