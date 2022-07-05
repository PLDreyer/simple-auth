import { Application, Request, Response } from 'express';
import { Handler } from '@simple-auth/core';
import { AUTH_HANDLER } from './constants';
import {
  AuthOptions,
  MALFORMED_API_KEY,
  MISSING_API_KEY,
  MULTIPLE_API_KEYS_FOUND,
} from '@simple-auth/types';

export const extractHandler = (
  app: Application
): Handler<Express.User, Request, Response> => {
  const handler = app.get(AUTH_HANDLER);
  // TODO implement error
  if (!handler) throw new Error('HANDLER IS MISSING');
  return handler;
};

// TODO implement extra cookie types
export const extractJwtFromCookie = (
  req: Request,
  cookieName: string,
  isSigned: boolean
): null | string => {
  let cookie = isSigned
    ? req.signedCookies[cookieName]
    : req.cookies[cookieName];

  if (!cookie) {
    cookie = isSigned ? req.cookies[cookieName] : req.signedCookies[cookieName];
  }

  if (!cookie) return null;

  return cookie;
};

export const extractApiKey = (
  req: Request,
  options: AuthOptions<Express.User, Request, Response>['apiKey']
) => {
  const { header, query, body } = options;

  for (const name of header.names) {
    const headerValue = req.header(name);

    if (headerValue && headerValue.length > 1)
      return [undefined, MULTIPLE_API_KEYS_FOUND];

    if (headerValue) return [headerValue[0], undefined];
  }

  for (const name of query.names) {
    const queryValue = req.query[name];

    if (Array.isArray(queryValue)) return [null, MULTIPLE_API_KEYS_FOUND];
    if (typeof queryValue === 'object' || queryValue === null)
      return [null, MALFORMED_API_KEY];

    if (queryValue) return [queryValue, null];
  }

  for (const name of body.names) {
    const bodyValue = req.body[name];
    if (bodyValue) return [bodyValue, null];
  }

  return [undefined, MISSING_API_KEY];
};
