import type { RefreshHandler } from './handler';
import type { CookieOptions } from './constants';

/**
 * Refresh options
 */
export type RefreshOptions<U, I, R> = {
  /**
   * Handler to find user with refresh token
   */
  find: RefreshHandler<U>['findRefresh'];
  /**
   * Handler to save refresh token for user
   */
  save: RefreshHandler<U>['saveRefresh'];
  /**
   * Handler to delete refresh token after usage
   */
  delete: RefreshHandler<U>['deleteRefresh'];
  /**
   * Cookie settings for refresh token
   */
  cookie?: CookieOptions;
  /**
   * Refresh JWT lifetime in seconds
   */
  lifetime?: number;
  /**
   * Refresh JWT secret
   */
  secret: string;
  /**
   * Custom response after refresh handler
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
