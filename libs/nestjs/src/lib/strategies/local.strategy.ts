import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AUTH_MODULE_OPTIONS } from '../constants';
import {
  AuthError,
  AuthOptions,
  InvalidUserCredentials,
  MissingUserCredentials,
} from '@simple-auth/core';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions
  ) {
    super();
  }

  async validate(
    req: Request
  ): Promise<[Express.User | null, AuthError | null]> {
    const [userFields, error] = this.getCredentialsFromReq(req);
    if (error) return [null, error];

    const user = await this.authService.validateUser(
      userFields.username,
      userFields.password
    );

    if (!user) {
      return [null, new InvalidUserCredentials()];
    }

    return [user, null];
  }

  private getCredentialsFromReq(
    req: Request
  ): [{ username: string; password: string } | null, AuthError | null] {
    const username = req?.body[this.authOptions.login.usernameField];
    const password = req?.body[this.authOptions.login.passwordField];

    if (!username || !password) return [null, new MissingUserCredentials()];

    return [{ username, password }, null];
  }
}
