import {DynamicModule, Module} from "@nestjs/common";
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {KeyStrategy} from "./strategies/key.strategy";
import {LocalStrategy} from "./strategies/local.strategy";
import {RefreshStrategy} from "./strategies/refresh.strategy";
import {TwofaStrategy} from "./strategies/twofa.strategy";
import {AnonymousStrategy} from "./strategies/anonymous.strategy";
import {AsyncAuthOptions, AUTH_DATABASE_METHODS, AUTH_MODULE_OPTIONS} from "./constants";
import {JwtSessionModule} from "./jwt/jwt.session.module";
import {JwtRefreshModule} from "./jwt/jwt.refresh.module";
import {AuthOptions} from "@simple-auth/core";
import {JwtModuleOptions} from "@nestjs/jwt";
import {Algorithm, JwtHeader} from "jsonwebtoken";

@Module({})
export class AuthConfigModule {
  public static forRootAsync<U>(options: AsyncAuthOptions<AuthOptions<U>>): DynamicModule {


    return {
      module: AuthConfigModule,
      imports: [
        ...options.imports ?? [],
      ],
      providers: [
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: AUTH_DATABASE_METHODS,
          useFactory: (authOptions: AuthOptions<U>) => {
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
          inject: [AUTH_MODULE_OPTIONS]
        }
      ],
      exports: [
        AUTH_MODULE_OPTIONS,
        AUTH_DATABASE_METHODS,
      ],
    }
  }

  public static verifyJwtOptions(): void {}
}

@Module({})
export class AuthModule {
  public static forRootAsync<U>(options: AsyncAuthOptions<AuthOptions<U>>): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [
        AuthConfigModule.forRootAsync<U>(options),
        JwtSessionModule.registerAsync({
          imports: [AuthConfigModule.forRootAsync<U>(options)],
          useFactory: async (authOptions: AuthOptions<U>): Promise<JwtModuleOptions> => {
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
          imports: [AuthConfigModule.forRootAsync<U>(options)],
          useFactory: async (authOptions: AuthOptions<U>): Promise<JwtModuleOptions> => {
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
        PassportModule,
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
    }
  }
}
