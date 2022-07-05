import type { SessionHandler } from './handler';
import type { CookieOptions } from './constants';

/**
 * Session options
 */
export type SessionOptions<U, I, R> = {
  /**
   * Handler to find user with session token
   */
  find: SessionHandler<U>['findSession'];
  /**
   * Handler to save session token for user
   */
  save: SessionHandler<U>['saveSession'];
  /**
   * Handler to delete session token after expiration
   */
  delete: SessionHandler<U>['deleteSession'];
  /**
   * Cookie settings for session token
   */
  cookie?: CookieOptions;
  /**
   * Session JWT lifetime in seconds
   */
  lifetime?: number;
  /**
   * Session JWT secret
   */
  secret: string;
  /**
   * Encrypt JWT content
   */
  encrypted?: boolean;
  /**
   * Custom response after session handler
   * @param req Request express request
   * @param res Response express response
   * @param accessToken string created access token
   * @param refreshToken string created refresh token
   * @returns Promise<unknown> Object to return
   */
  customResponse?: (
    req: I,
    res: R,
    accessToken: string,
    refreshToken: string
  ) => Promise<unknown>;
};
