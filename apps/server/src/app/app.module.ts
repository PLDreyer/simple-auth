import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import configuration from '../config/config';
import { UsersService } from './users/users.service';
import { AuthModule } from '@simple-auth/nestjs';
import { AuthError, AuthOptions } from '@simple-auth/core';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}

    // tslint:disable-next-line:no-empty-interface
    interface User {
      name: string;
      twoFaSecret: string | undefined;
    }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    UsersModule,
    AuthModule.forRootAsync({
      imports: [UsersModule],
      useFactory: async (
        usersService: UsersService,
        configService: ConfigService
      ): Promise<AuthOptions> => {
        return {
          apiKey: {
            header: {
              names: ['key'],
            },
            query: {
              names: ['key'],
            },
            body: {
              names: ['key'],
            },
            async find(key: string): Promise<Express.User | null> {
              return usersService.findOneApiKey(key);
            },
          },
          login: {
            usernameField: 'email',
            passwordField: 'password',
            async find(
              username: string,
              password: string
            ): Promise<Express.User> {
              return usersService.findOneUser(username, password);
            },
            twoFa: {
              async findTwoFaSessionToken(
                id: string
              ): Promise<Express.User | null> {
                return usersService.findTwoFaSessionToken(id);
              },
              async saveTwoFaSessionToken(
                id: string,
                user: Express.User
              ): Promise<void> {
                return usersService.saveTwoFaSessionToken(id, user);
              },
              async deleteTwoFaSessionToken(id: string): Promise<void> {
                return usersService.deleteTwoFaSessionToken(id);
              },
              shouldValidateTwoFa(user: Express.User): Promise<boolean> {
                return usersService.shouldValidateTwoFaToken(user);
              },
              async validateTwoFaCode(code: string): Promise<boolean> {
                return usersService.validateTwoFaCode(code);
              },
            },
          },
          session: {
            cookie: {
              name: 'session',
              secure: false,
              path: '/',
              httpOnly: false,
              signed: false,
            },
            secret: 'secret_session',
            encrypted: true,
            lifetime: 15 * 60, // 15 minutes
            async save(id: string, user: Express.User): Promise<void> {
              return usersService.saveOneSession(id, user);
            },
            async find(id: string): Promise<Express.User> {
              return usersService.findOneSession(id);
            },
            async delete(id: string): Promise<void> {
              return usersService.deleteOneSession(id);
            },
          },
          refresh: {
            cookie: {
              name: 'refresh',
              secure: false,
              path: '/',
              httpOnly: false,
              signed: false,
            },
            secret: 'secret_refresh',
            lifetime: 14 * 24 * 60 * 60, // 14 days
            async save(id: string, user: Express.User): Promise<void> {
              return usersService.saveOneRefresh(id, user);
            },
            async find(id: string): Promise<Express.User> {
              return usersService.findOneRefresh(id);
            },
            async delete(id: string): Promise<void> {
              return usersService.deleteOneRefresh(id);
            },
          },
          parser: {
            cookieSecret: 'secret',
          },
          error: async (error: AuthError) => {
            throw error;
          },
        };
      },
      inject: [UsersService, ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
