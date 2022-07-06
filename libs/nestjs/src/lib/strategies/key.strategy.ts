import type { Handler } from '@simple-auth/core';
import type { Request, Response } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH_HANDLER } from '../constants';
import {
  INTERNAL_AUTH_ERROR,
  INVALID_API_KEY,
  MALFORMED_API_KEY,
  MISSING_API_KEY,
  MULTIPLE_API_KEYS_FOUND,
} from '@simple-auth/types';

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

    const [apiKey, apiKeyError] = this.getApiKeyFromFields(req);
    if (apiKeyError) return [null, apiKeyError];

    const [user, error] = await this.authHandler.getUserWithApiKey(apiKey);

    if (!user) {
      switch (error) {
        case MISSING_API_KEY:
        case INVALID_API_KEY:
          return [null, error];
      }

      return [null, INTERNAL_AUTH_ERROR];
    }

    return [user, null];
  }

  private getApiKeyFromFields(req: Request): [string | null, string | null] {
    const { header, query, body } = this.authHandler.options.apiKey;

    for (const name of header.names) {
      const headerValue = req.header(name);

      if (headerValue && headerValue.length > 1)
        return [undefined, MULTIPLE_API_KEYS_FOUND];

      if (headerValue) return [headerValue[0], null];
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

    return [null, null];
  }
}
