import express, { Request, Response } from 'express';
import { init } from '@simple-auth/express';
import { AuthOptions } from '@simple-auth/types';
import AuthService from './services/auth.service';
import UsersRouter from './router/users.router';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}

    // tslint:disable-next-line:no-empty-interface
    interface User {
      name: string;
      twoFaSecret: string;
    }
  }
}

const options: AuthOptions<Express.User, Request, Response> = {
  apiKey: {
    query: {
      names: ['apikey'],
    },
    header: {
      names: ['apikey'],
    },
    body: {
      names: ['apikey'],
    },
    find: AuthService.findOneApiKey,
  },
  login: {
    usernameField: 'email',
    passwordField: 'password',
    find: AuthService.findOneUser,
    twoFa: {
      saveTwoFaSessionToken: AuthService.saveTwoFaSessionToken,
      findTwoFaSessionToken: AuthService.findTwoFaSessionToken,
      deleteTwoFaSessionToken: AuthService.deleteTwoFaSessionToken,
      validateTwoFaCode: AuthService.validateTwoFaCode,
      shouldValidateTwoFa: AuthService.shouldValidateTwoFaToken,
    },
  },
  session: {
    cookie: {
      name: 'session',
      signed: true,
      secure: false,
      httpOnly: false,
      domain: 'localhost',
      path: '/',
    },
    secret: 'session_secret',
    find: AuthService.findOneSession,
    delete: AuthService.deleteOneSession,
    save: AuthService.saveOneSession,
  },
  refresh: {
    cookie: {
      name: 'refresh',
      signed: true,
      secure: false,
      httpOnly: false,
      domain: 'localhost',
      path: '/',
    },
    secret: 'refresh_secret',
    find: AuthService.findOneRefresh,
    delete: AuthService.deleteOneRefresh,
    save: AuthService.saveOneRefresh,
  },
  parser: {
    cookieSecret: 'very_secure',
  },
};

const app = express();
init(app, options);
app.use('/users', UsersRouter);
app.listen(8080, () => console.log('Server started'));
