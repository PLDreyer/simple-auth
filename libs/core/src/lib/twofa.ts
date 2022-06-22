import { Request, Response } from 'express';
import { TwoFaHandler } from './handler';

/**
 * 2FA options
 */
export type TwoFaOptions<U> = {
  /**
   * Handler to save 2fa token
   */
  saveTwoFaSessionToken: TwoFaHandler<U>['saveTwoFaSessionToken'];
  /**
   * Handler to find user with 2fa token
   */
  findTwoFaSessionToken: TwoFaHandler<U>['findTwoFaSessionToken'];
  /**
   * Handler to delete 2fa token
   */
  deleteTwoFaSessionToken: TwoFaHandler<U>['deleteTwoFaSessionToken'];
  /**
   * Handler to check if user requires 2fa
   */
  shouldValidateTwoFa: TwoFaHandler<U>['shouldValidateTwoFa'];
  /**
   * Handler to validate 2fa code
   */
  validateTwoFaCode: TwoFaHandler<U>['validateTwoFaCode'];
  /**
   * Custom response after 2fa handler
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
