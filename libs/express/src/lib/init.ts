import { Application, Request, Response } from 'express';
import passport from 'passport';
import { AuthOptions } from '@simple-auth/types';
import { Handler } from '@simple-auth/core';
import { LocalStrategy } from './strategies/local.strategy';
import { AUTH_HANDLER } from './constants';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { KeyStrategy } from './strategies/key.strategy';
import { TwofaStrategy } from './strategies/twofa.strategy';
import { applyRoutes } from './routes/auth';
import cookieParser = require('cookie-parser');
import bodyParser from 'body-parser';
import { SessionStrategy } from './strategies/session.strategy';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}

    // tslint:disable-next-line:no-empty-interface
    interface User {
      id: string;
    }
  }
}

export const init = (
  app: Application,
  options: AuthOptions<Express.User, Request, Response>
) => {
  const logger = {
    log: (msg: string) => console.log(msg),
    warn: (msg: string) => console.log(msg),
    error: (msg: string) => console.log(msg),
    debug: (msg: string) => console.log(msg),
  };

  const handler = new Handler<Express.User, Request, Response>(options, logger);

  const cookieSecret = handler.options.parser.cookieSecret;
  app.use(cookieParser(cookieSecret));
  app.use(bodyParser());

  app.set(AUTH_HANDLER, handler);

  applyRoutes(app);

  app.use(passport.initialize());
  passport.use('local', LocalStrategy);
  passport.use('session', SessionStrategy);
  passport.use('refresh', RefreshStrategy);
  passport.use('key', KeyStrategy);
  passport.use('twofa', TwofaStrategy);
};
