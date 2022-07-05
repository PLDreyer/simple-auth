import { DynamicModule, Logger, Module } from '@nestjs/common';
import {
  AsyncAuthOptions,
  AUTH_HANDLER,
  AUTH_MODULE_OPTIONS_USER,
} from './constants';
import { Request, Response } from 'express';
import { AuthOptions } from '@simple-auth/types';
import { Handler } from '@simple-auth/core';

@Module({})
export class AuthConfigModule {
  public static forRootAsync(
    options: AsyncAuthOptions<AuthOptions<Express.User, Request, Response>>
  ): DynamicModule {
    return {
      module: AuthConfigModule,
      imports: [...(options.imports ?? [])],
      providers: [
        {
          provide: AUTH_MODULE_OPTIONS_USER,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: AUTH_HANDLER,
          useFactory: (
            authOptions: AuthOptions<Express.User, Request, Response>
          ): Handler<Express.User, Request, Response> => {
            return new Handler<Express.User, Request, Response>(
              authOptions,
              Logger
            );
          },
          inject: [AUTH_MODULE_OPTIONS_USER],
        },
      ],
      exports: [AUTH_HANDLER],
    };
  }
}
