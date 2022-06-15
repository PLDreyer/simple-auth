import {Request, Response} from "express";

export type AuthOptions<U> = {
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
    find: (key: string) => Promise<U>;
    error?: (error: string) => Promise<void>;
  };
  login: {
    usernameField?: string;
    passwordField?: string;
    find: (username: string, password: string) => Promise<U>;
    customResponse?: (req: Request) => Promise<unknown>,
    error?: (error: string) => Promise<void>;
  };
  anonymous?: {
    find: (id: string) => Promise<U>;
    save: (id: string) => Promise<void>;
    error?: (error: string) => Promise<void>;
  };
  session?: {
    find: (id: string) => Promise<U>;
    save: (id: string) => Promise<void>;
    cookie?: {
      name?: string;
      secure?: boolean;
      signed?: boolean;
      httpOnly?: boolean;
      domain?: string;
      path?: string;
    };
    single?: boolean;
    lifetime?: number;
    encrypted?: boolean;
    secret: string;
    customResponse?: (req: Request, res: Response, accessToken: string) => Promise<unknown>,
    error?: (error: string) => Promise<void>;
  };
  refresh?: {
    find: (id: string) => Promise<boolean>;
    save: (id: string) => Promise<void>;
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
    error?: (error: string) => Promise<void>;
  };
}
