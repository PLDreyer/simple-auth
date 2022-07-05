import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { KeyStrategy } from './strategies/key.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { TwofaStrategy } from './strategies/twofa.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { AsyncAuthOptions, AUTH_HANDLER } from './constants';
import { AuthOptions } from '@simple-auth/types';
import * as cookieParser from 'cookie-parser';
import { AuthConfigModule } from './auth-config.module';
import { Request, Response } from 'express';
import { Handler } from '@simple-auth/core';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
    }
  }
}

@Module({})
export class AuthModule implements NestModule {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.authHandler.options.parser.cookieSecret !== undefined
          ? cookieParser(this.authHandler.options.parser.cookieSecret)
          : cookieParser()
      )
      .forRoutes('*');
  }

  public static forRootAsync(
    options: AsyncAuthOptions<AuthOptions<Express.User, Request, Response>>
  ): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [AuthConfigModule.forRootAsync(options), PassportModule],
      controllers: [AuthController],
      providers: [
        JwtStrategy,
        RefreshStrategy,
        KeyStrategy,
        LocalStrategy,
        TwofaStrategy,
        AnonymousStrategy,
      ],
      exports: [AuthConfigModule],
    };
  }
}
