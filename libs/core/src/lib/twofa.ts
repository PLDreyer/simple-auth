import { Request, Response } from 'express';

export type TwoFaMethods = {
  saveTwoFaSessionToken: (id: string, user: Express.User) => Promise<void>;
  findTwoFaSessionToken: (id: string) => Promise<Express.User | null>;
  deleteTwoFaSessionToken: (id: string) => Promise<void>;
  shouldValidateTwoFa: (user: Express.User) => Promise<boolean>;
  validateTwoFaCode: (code: string) => Promise<boolean>;
};

export type TwoFaOptions = {
  saveTwoFaSessionToken: TwoFaMethods['saveTwoFaSessionToken'];
  findTwoFaSessionToken: TwoFaMethods['findTwoFaSessionToken'];
  deleteTwoFaSessionToken: TwoFaMethods['deleteTwoFaSessionToken'];
  shouldValidateTwoFa: TwoFaMethods['shouldValidateTwoFa'];
  validateTwoFaCode: TwoFaMethods['validateTwoFaCode'];
  customResponse?: (
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string
  ) => Promise<unknown>;
};
