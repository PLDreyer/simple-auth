import { Request, Response } from 'express';
import { TwoFaOptions } from './twofa';
import { LoginHandler } from './handler';

/**
 * Login options
 */
export type LoginOptions<U> = {
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
  twoFa?: TwoFaOptions<U>;
  /**
   * Custom response after login handler
   * @param req Request express request
   * @param res Response express response
   * @param accessToken string created access token
   * @param refreshToken string created refresh token
   * @returns Promise<unknown> Object to return
   */
  customResponse?: (
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string
  ) => Promise<unknown>;
};
