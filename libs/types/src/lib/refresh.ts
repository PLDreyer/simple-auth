import { RefreshHandler } from './handler';

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
  cookie?: {
    /**
     * Cookie name
     */
    name?: string;
    /**
     * Cookie secure (https)
     */
    secure?: boolean;
    /**
     * // TODO implement signed description
     * Cookie signed
     */
    signed?: boolean;
    /**
     * Cookie http-only (no javascript interoperability)
     */
    httpOnly?: boolean;
    /**
     * Cookie domain to save at
     */
    domain?: string;
    /**
     * Cookie path to save at
     */
    path?: string;
    /**
     * Cookie expires
     */
    expires?: Date;
    /**
     * Cookie same site
     */
    sameSite?: 'lax' | 'strict' | 'none';
  };
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
