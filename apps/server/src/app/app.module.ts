import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UsersModule} from "./users/users.module";
import configuration from '../config/config';
import {UsersService} from "./users/users.service";
import {AuthModule} from "@simple-auth/nestjs";
import {AuthOptions} from "@simple-auth/core";

type User = {};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: [
        '.env.development.local',
        '.env.development'
      ],
      isGlobal: true,
    }),
    UsersModule,
    AuthModule.forRootAsync<User>({
      imports: [UsersModule],
      useFactory: async (
        usersService: UsersService,
        configService: ConfigService
      ): Promise<AuthOptions<User>> => {
        return {
          apiKey: {
            header: {
              names: ["key"]
            },
            query: {
              names: ["key"]
            },
            body: {
              names: ["key"]
            },
            async find(key: string): Promise<User> {
              return usersService.findOneApiKey<User>(key);
            }
          },
          login: {
            usernameField: "email",
            passwordField: "password",
            async find(username: string, password: string): Promise<User> {
              return usersService.findOneUser<User>(username, password);
            }
          },
          anonymous: {
            async save(id: string): Promise<void> {

            },
            async find(id: string): Promise<any> {

            }
          },
          session: {
            cookie: {
              name: "session",
            },
            secret: "secret_session",
            encrypted: true,
            single: false,
            lifetime: 15 * 60, // 15 minutes
            async save(id: string): Promise<void> {
              return usersService.saveOneSession(id);
            },
            async find(id: string): Promise<User> {
              return usersService.findOneSession<User>(id);
            }
          },
          refresh: {
            cookie: {
              name: "refresh",
            },
            secret: "secret_refresh",
            lifetime: 14 * 24 * 60 * 60, // 14 days
            async save(id: string): Promise<void> {
              return usersService.saveOneRefresh(id);
            },
            async find(id: string): Promise<boolean> {
              return usersService.findOneRefresh(id);
            }
          },
        }
      },
      inject: [UsersService, ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
