import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from '../auth.service';
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthOptions, MissingUser} from "@simple-auth/core";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
    ) {
    super({
      usernameField: authOptions.login.usernameField,
      passwordField: authOptions.login.passwordField,
    });
  }

  async validate(username: string, password: string): Promise<unknown> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      return [null, new MissingUser()];
    }

    return user;
  }
}
