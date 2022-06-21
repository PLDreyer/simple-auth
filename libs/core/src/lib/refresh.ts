import { Request, Response } from 'express';

export type RefreshMethods = {
  find: (id: string) => Promise<Express.User | null>;
  save: (id: string, user: Express.User) => Promise<void>;
  delete: (id: string) => Promise<void>;
};

export type RefreshOptions = {
  find: RefreshMethods['find'];
  save: RefreshMethods['save'];
  delete: RefreshMethods['delete'];
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
  customResponse?: (
    req: Request,
    res: Response,
    refreshToken: string
  ) => Promise<unknown>;
};
