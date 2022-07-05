import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  InternalAuthError,
  InvalidApiKey,
  MalformedApiKey,
  MissingApiKey,
  MultipleApiKeysFound,
} from '../auth.exceptions';
import { AUTH_HANDLER } from '../constants';
import { Handler } from '@simple-auth/core';
import { INVALID_API_KEY, MISSING_API_KEY } from '@simple-auth/types';

@Injectable()
export class KeyStrategy extends PassportStrategy(Strategy, 'key') {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {
    super();
  }

  /**
   * @param req
   * @returns user, info, status
   */
  async validate(req: Request) {
    if (!this.authHandler.options.apiKey) return [null, null];

    const apiKey = this.getApiKeyFromFields(req);
    const [user, error] = await this.authHandler.getUserWithApiKey(apiKey);

    if (!user) {
      switch (error) {
        case MISSING_API_KEY:
          return [null, new MissingApiKey()];
        case INVALID_API_KEY:
          return [null, new InvalidApiKey()];
        default:
          return [null, new InternalAuthError()];
      }
    }

    return [user, null];
  }

  private getApiKeyFromFields(req: Request): string | undefined {
    const { header, query, body } = this.authHandler.options.apiKey;

    for (const name of header.names) {
      const headerValue = req.header(name);

      if (headerValue && headerValue.length > 1)
        throw new MultipleApiKeysFound();

      if (headerValue) return headerValue[0];
    }

    for (const name of query.names) {
      const queryValue = req.query[name];

      if (Array.isArray(queryValue)) throw new MultipleApiKeysFound();
      if (typeof queryValue === 'object' || queryValue === null)
        throw new MalformedApiKey();

      if (queryValue) return queryValue;
    }

    for (const name of body.names) {
      const bodyValue = req.body[name];
      if (bodyValue) return bodyValue;
    }

    return undefined;
  }
}
