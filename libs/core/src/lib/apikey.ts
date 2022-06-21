import { Request } from 'express';

export type ApiKeyMethods = {
  find: (key: string) => Promise<Express.User | null>;
};

export type ApiKeyOptions = {
  header?: {
    names?: Array<string>;
  };
  query?: {
    names?: Array<string>;
  };
  body?: {
    names?: Array<string>;
  };
  find: ApiKeyMethods['find'];
  // TODO customResponse currently not implemented for apikeys
  customResponse?: (req: Request) => Promise<unknown>;
};
