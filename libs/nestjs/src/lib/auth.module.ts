import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { KeyStrategy } from './strategies/key.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { TwofaStrategy } from './strategies/twofa.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { AsyncAuthOptions, AUTH_MODULE_OPTIONS } from './constants';
import { JwtSessionModule } from './jwt/jwt.session.module';
import { JwtRefreshModule } from './jwt/jwt.refresh.module';
import { AuthOptions } from '@simple-auth/core';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { AuthConfigModule } from './auth-config.module';

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
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.authOptions.parser.cookieSecret !== undefined
          ? cookieParser(this.authOptions.parser.cookieSecret)
          : cookieParser()
      )
      .forRoutes('*');
  }

  public static forRootAsync(
    options: AsyncAuthOptions<AuthOptions>
  ): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [
        AuthConfigModule.forRootAsync(options),
        JwtSessionModule.registerAsync({
          imports: [AuthConfigModule.forRootAsync(options)],
          useFactory: async (
            authOptions: AuthOptions
          ): Promise<JwtModuleOptions> => {
            return {
              secret: authOptions.session.secret,
              signOptions: {
                expiresIn: authOptions.session.lifetime,
              },
              verifyOptions: {
                ignoreExpiration: false,
                ignoreNotBefore: false,
                maxAge: authOptions.session.lifetime,
              },
            };
          },
          inject: [AUTH_MODULE_OPTIONS],
        }),
        JwtRefreshModule.registerAsync({
          imports: [AuthConfigModule.forRootAsync(options)],
          useFactory: async (
            authOptions: AuthOptions
          ): Promise<JwtModuleOptions> => {
            return {
              secret: authOptions.refresh.secret,
              signOptions: {
                expiresIn: authOptions.refresh.lifetime,
              },
              verifyOptions: {
                ignoreExpiration: false,
                ignoreNotBefore: false,
                maxAge: authOptions.refresh.lifetime,
              },
            };
          },
          inject: [AUTH_MODULE_OPTIONS],
        }),
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [
        JwtStrategy,
        RefreshStrategy,
        AuthService,
        KeyStrategy,
        LocalStrategy,
        TwofaStrategy,
        AnonymousStrategy,
      ],
      exports: [AuthConfigModule],
    };
  }
}
