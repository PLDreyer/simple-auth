import type { TwoFaOptions } from './twofa';
import type { LoginHandler } from './handler';

/**
 * Login options
 */
export type LoginOptions<U, I, R> = {
  /**
   * User identifier field to look for in body
   */
  usernameField?: string;
  /**
   * User password field to look for in body
   */
  passwordField?: string;
  /**
   * Handler for login action
   */
  find: LoginHandler<U>['findLogin'];
  /**
   * 2Fa options
   */
  twoFa?: TwoFaOptions<U, I, R>;
  /**
   * Custom response after login handler
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
