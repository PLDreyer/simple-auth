import { DynamicModule, Module } from '@nestjs/common';
import {
  AsyncAuthOptions,
  AUTH_MODULE_OPTIONS,
  AUTH_MODULE_OPTIONS_USER,
} from './constants';
import { AuthOptions } from '@simple-auth/core';

@Module({})
export class AuthConfigModule {
  public static forRootAsync(
    options: AsyncAuthOptions<AuthOptions<Express.User>>
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
          provide: AUTH_MODULE_OPTIONS,
          useFactory: (
            authOptions: AuthOptions<Express.User>
          ): AuthOptions<Express.User> => {
            return this.verifyAuthModuleOptions(authOptions);
          },
          inject: [AUTH_MODULE_OPTIONS_USER],
        },
      ],
      exports: [AUTH_MODULE_OPTIONS_USER, AUTH_MODULE_OPTIONS],
    };
  }

  public static verifyAuthModuleOptions(
    authModuleOptions: AuthOptions<Express.User>
  ): AuthOptions<Express.User> {
    return {
      apiKey: this.verifyApiKeyOptions(authModuleOptions.apiKey),
      login: this.verifyLoginOptions(authModuleOptions.login),
      session: this.verifySessionOptions(authModuleOptions.session),
      refresh: this.verifyRefreshOptions(authModuleOptions.refresh),
      parser: authModuleOptions.parser || {},
      error: authModuleOptions.error,
    };
  }

  public static verifyApiKeyOptions(
    keyOptions: AuthOptions<Express.User>['apiKey']
  ): AuthOptions<Express.User>['apiKey'] {
    return keyOptions;
  }

  public static verifyLoginOptions(
    loginOptions: AuthOptions<Express.User>['login']
  ): AuthOptions<Express.User>['login'] {
    return loginOptions;
  }

  public static verifySessionOptions(
    sessionOptions: AuthOptions<Express.User>['session']
  ): AuthOptions<Express.User>['session'] {
    return {
      find: sessionOptions.find,
      save: sessionOptions.save,
      delete: sessionOptions.delete,
      cookie: {
        name: sessionOptions.cookie.name ?? 'session',
        secure: sessionOptions.cookie.secure ?? true,
        signed: sessionOptions.cookie.signed ?? true,
        httpOnly: sessionOptions.cookie.httpOnly ?? true,
        domain: sessionOptions.cookie.domain ?? undefined,
        path: sessionOptions.cookie.path ?? undefined,
        expires:
          sessionOptions.cookie.expires ??
          new Date(
            sessionOptions.lifetime
              ? sessionOptions.lifetime * 1000
              : 15 * 60 * 1000
          ),
        sameSite: sessionOptions.cookie.sameSite ?? 'lax',
      },
      lifetime: sessionOptions.lifetime ?? 15 * 60, // 15 minutes
      encrypted: sessionOptions.encrypted ?? false,
      secret: sessionOptions.secret,
      customResponse: sessionOptions.customResponse ?? undefined,
    };
  }

  public static verifyRefreshOptions(
    refreshOptions: AuthOptions<Express.User>['refresh']
  ): AuthOptions<Express.User>['refresh'] {
    return {
      find: refreshOptions.find,
      save: refreshOptions.save,
      delete: refreshOptions.delete,
      cookie: {
        name: refreshOptions.cookie.name ?? 'refresh',
        secure: refreshOptions.cookie.secure ?? true,
        signed: refreshOptions.cookie.signed ?? true,
        httpOnly: refreshOptions.cookie.httpOnly ?? true,
        domain: refreshOptions.cookie.domain ?? undefined,
        path: refreshOptions.cookie.path ?? undefined,
        expires:
          refreshOptions.cookie.expires ??
          new Date(
            refreshOptions.lifetime
              ? refreshOptions.lifetime * 1000
              : 14 * 24 * 60 * 60 * 1000
          ),
        sameSite: refreshOptions.cookie.sameSite ?? 'lax',
      },
      lifetime: refreshOptions.lifetime ?? 14 * 24 * 60 * 60, // 14 days
      secret: refreshOptions.secret,
      customResponse: refreshOptions.customResponse ?? undefined,
    };
  }
}
