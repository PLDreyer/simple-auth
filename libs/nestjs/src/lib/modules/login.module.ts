import { DynamicModule, Module } from '@nestjs/common';
import { JwtSessionModule } from '../jwt/jwt.session.module';
import { AuthConfigModule } from '../auth-config.module';
import { AuthOptions } from '@simple-auth/core';
import { JwtModuleOptions } from '@nestjs/jwt';
import { AUTH_MODULE_OPTIONS } from '../constants';
import { LocalStrategy } from '../strategies/local.strategy';
import { LoginService } from '../services/login.service';

@Module({})
export class LoginModule {
  public static registerAsync(options): DynamicModule {
    return {
      module: LoginModule,
      imports: [
        ...(options.imports || []),
        JwtSessionModule.registerAsync({
          imports: [AuthConfigModule],
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
      ],
      providers: [LoginService, LocalStrategy],
      exports: [JwtSessionModule],
    };
  }
}
