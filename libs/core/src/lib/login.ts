import { Request, Response } from 'express';
import { TwoFaOptions } from './twofa';

export type LoginMethods = {
  find: (username: string, password: string) => Promise<Express.User | null>;
};

export type LoginOptions = {
  usernameField?: string;
  passwordField?: string;
  find: LoginMethods['find'];
  twoFa?: TwoFaOptions;
  customResponse?: (
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string
  ) => Promise<unknown>;
};
