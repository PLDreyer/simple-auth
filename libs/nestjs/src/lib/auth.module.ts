import {DynamicModule, Inject, MiddlewareConsumer, Module, NestModule, RequestMethod,} from "@nestjs/common";
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {KeyStrategy} from "./strategies/key.strategy";
import {LocalStrategy} from "./strategies/local.strategy";
import {RefreshStrategy} from "./strategies/refresh.strategy";
import {TwofaStrategy} from "./strategies/twofa.strategy";
import {AnonymousStrategy} from "./strategies/anonymous.strategy";
import {AsyncAuthOptions, AUTH_DATABASE_METHODS, AUTH_MODULE_OPTIONS, AUTH_MODULE_OPTIONS_USER} from "./constants";
import {JwtSessionModule} from "./jwt/jwt.session.module";
import {JwtRefreshModule} from "./jwt/jwt.refresh.module";
import {AuthOptions} from "@simple-auth/core";
import {JwtModuleOptions} from "@nestjs/jwt";
import * as cookieParser from "cookie-parser";
import {MiddlewareBuilder} from "@nestjs/core";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

@Module({})
export class AuthConfigModule {
  public static forRootAsync(options: AsyncAuthOptions<AuthOptions>): DynamicModule {
    return {
      module: AuthConfigModule,
      imports: [
        ...options.imports ?? [],
      ],
      providers: [
        {
          provide: AUTH_MODULE_OPTIONS_USER,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: AUTH_DATABASE_METHODS,
          useFactory: (authOptions: AuthOptions) => {
            return {
              findOneUser: authOptions.login.find,
              findOneApikey: authOptions.apiKey.find,
              findOneAnonymous: authOptions.anonymous.find,
              saveOneAnonymous: authOptions.anonymous.save,
              findOneSession: authOptions.session.find,
              saveOneSession: authOptions.session.save,
              findOneRefresh: authOptions.refresh.find,
              saveOneRefresh: authOptions.refresh.save,
            }
          },
          inject: [AUTH_MODULE_OPTIONS_USER]
        },
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: (authOptions: AuthOptions): AuthOptions => {
            return this.verifyAuthModuleOptions(authOptions);
          },
          inject: [AUTH_MODULE_OPTIONS_USER]
        }
      ],
      exports: [
        AUTH_MODULE_OPTIONS_USER,
        AUTH_MODULE_OPTIONS,
        AUTH_DATABASE_METHODS,
      ],
    }
  }

  public static verifyAuthModuleOptions(
    authModuleOptions: AuthOptions
  ): AuthOptions {
    return {
      apiKey: this.verifyApiKeyOptions(authModuleOptions.apiKey),
      login: this.verifyLoginOptions(authModuleOptions.login),
      anonymous: authModuleOptions.anonymous,
      session: this.verifySessionOptions(authModuleOptions.session),
      refresh: this.verifyRefreshOptions(authModuleOptions.refresh),
      parser: authModuleOptions.parser || {},
      error: authModuleOptions.error,
    }
  }

  public static verifyApiKeyOptions(
    keyOptions: AuthOptions["apiKey"]
  ): AuthOptions["apiKey"] {
    return keyOptions;
  }

  public static verifyLoginOptions(
    loginOptions: AuthOptions["login"]
  ): AuthOptions["login"] {
    return loginOptions;
  }

  public static verifySessionOptions(
    sessionOptions: AuthOptions["session"]
  ): AuthOptions["session"] {
    return {
      find: sessionOptions.find,
      save: sessionOptions.save,
      delete: sessionOptions.delete,
      cookie: {
        name: sessionOptions.cookie.name ?? "session",
        secure: sessionOptions.cookie.secure ?? true,
        signed: sessionOptions.cookie.signed ?? true,
        httpOnly: sessionOptions.cookie.httpOnly ?? true,
        domain: sessionOptions.cookie.domain ?? undefined,
        path: sessionOptions.cookie.path ?? undefined,
      },
      lifetime: sessionOptions.lifetime ?? 15 * 60, // 15 minutes
      encrypted: sessionOptions.encrypted ?? false,
      secret: sessionOptions.secret,
      customResponse: sessionOptions.customResponse ?? undefined,
    }
  }

  public static verifyRefreshOptions(
    refreshOptions: AuthOptions["refresh"]
  ): AuthOptions["refresh"] {
    return {
      find: refreshOptions.find,
      save: refreshOptions.save,
      delete: refreshOptions.delete,
      cookie: {
        name: refreshOptions.cookie.name ?? "refresh",
        secure: refreshOptions.cookie.secure ?? true,
        signed: refreshOptions.cookie.signed ?? true,
        httpOnly: refreshOptions.cookie.httpOnly ?? true,
        domain: refreshOptions.cookie.domain ?? undefined,
        path: refreshOptions.cookie.path ?? undefined,
      },
      lifetime: refreshOptions.lifetime ?? 14 * 24 * 60 * 60, // 14 days
      secret: refreshOptions.secret,
      customResponse: refreshOptions.customResponse ?? undefined,
    }
  }
}

@Module({})
export class AuthModule implements NestModule {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      this.authOptions.parser.cookieSecret !== undefined ?
        cookieParser(this.authOptions.parser.cookieSecret) : cookieParser(),
    ).forRoutes("*")
  }

  public static forRootAsync(options: AsyncAuthOptions<AuthOptions>): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [
        AuthConfigModule.forRootAsync(options),
        JwtSessionModule.registerAsync({
          imports: [AuthConfigModule.forRootAsync(options)],
          useFactory: async (authOptions: AuthOptions): Promise<JwtModuleOptions> => {
            return {
              secret: authOptions.session.secret,
              signOptions: {
                expiresIn: authOptions.session.lifetime,
              },
              verifyOptions: {
                ignoreExpiration: false,
                ignoreNotBefore: false,
                maxAge: authOptions.session.lifetime
              }
            };
          },
          inject: [AUTH_MODULE_OPTIONS]
        }),
        JwtRefreshModule.registerAsync({
          imports: [AuthConfigModule.forRootAsync(options)],
          useFactory: async (authOptions: AuthOptions): Promise<JwtModuleOptions> => {
            return {
              secret: authOptions.refresh.secret,
              signOptions: {
                expiresIn: authOptions.refresh.lifetime,
              },
              verifyOptions: {
                ignoreExpiration: false,
                ignoreNotBefore: false,
                maxAge: authOptions.refresh.lifetime
              }
            };
          },
          inject: [AUTH_MODULE_OPTIONS]
        }),
        PassportModule
      ],
      controllers: [
        AuthController
      ],
      providers: [
        AuthService,
        JwtStrategy,
        KeyStrategy,
        LocalStrategy,
        RefreshStrategy,
        TwofaStrategy,
        AnonymousStrategy,
      ],
      exports: [
        AuthConfigModule,
      ]
    }
  }
}
