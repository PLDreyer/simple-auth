import {Request, Response} from "express";
import {AuthListException} from "./auth.exceptions";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {}
  }
}

export type AuthOptions = {
  apiKey?: {
    header?: {
      names?: Array<string>;
    };
    query?: {
      names?: Array<string>;
    };
    body?: {
      names?: Array<string>;
    };
    find: (key: string) => Promise<Express.User | null>;
  };
  login: {
    usernameField?: string;
    passwordField?: string;
    find: (username: string, password: string) => Promise<Express.User | null>;
    customResponse?: (req: Request) => Promise<unknown>,
  };
  session?: {
    find: (id: string) => Promise<Express.User | null>;
    save: (id: string, user: Express.User) => Promise<void>;
    delete: (id: string) => Promise<void>;
    cookie?: {
      name?: string;
      secure?: boolean;
      signed?: boolean;
      httpOnly?: boolean;
      domain?: string;
      path?: string;
    };
    lifetime?: number;
    encrypted?: boolean;
    secret: string;
    customResponse?: (req: Request, res: Response, accessToken: string, refreshToken: string) => Promise<unknown>,
  };
  refresh?: {
    find: (id: string) => Promise<Express.User | null>;
    save: (id: string, user: Express.User) => Promise<void>;
    delete: (id: string) => Promise<void>;
    cookie?: {
      name?: string;
      secure?: boolean;
      signed?: boolean;
      httpOnly?: boolean;
      domain?: string;
      path?: string;
    };
    lifetime?: number;
    secret: string;
    customResponse?: (req: Request, res: Response, refreshToken: string) => Promise<unknown>,
  };
  parser?: {
    cookieSecret?: string | Array<string>;
  };
  error?: (errors: AuthListException) => Promise<never>;
}
