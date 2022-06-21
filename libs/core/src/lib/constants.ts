import { AuthListException } from './auth.exceptions';
import { SessionOptions } from './session';
import { ApiKeyOptions } from './apikey';
import { RefreshOptions } from './refresh';
import { LoginOptions } from './login';
import { ParserOptions } from './parser';
import { EndpointOptions } from './endpoints';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {}
  }
}

export type AuthOptions = {
  apiKey?: ApiKeyOptions;
  login: LoginOptions;
  session?: SessionOptions;
  refresh?: RefreshOptions;
  parser?: ParserOptions;
  endpoints?: EndpointOptions;
  error?: (errors: AuthListException) => Promise<never>;
};
