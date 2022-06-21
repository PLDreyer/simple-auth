import { Request, Response } from 'express';

export type SessionMethods = {
  find: (id: string) => Promise<Express.User | null>;
  save: (id: string, user: Express.User) => Promise<void>;
  delete: (id: string) => Promise<void>;
};

export type SessionOptions = {
  find: SessionMethods['find'];
  save: SessionMethods['save'];
  delete: SessionMethods['delete'];
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
  customResponse?: (
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string
  ) => Promise<unknown>;
};
