import { Inject, Injectable } from '@nestjs/common';
import { AUTH_MODULE_OPTIONS } from '../constants';
import { AuthOptions } from '@simple-auth/core';
import { JwtSessionService } from '../jwt/jwt.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @Inject(JwtSessionService)
    private readonly jwtSessionService: JwtService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.authOptions.login.find(username, pass);
  }
}
