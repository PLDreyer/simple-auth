import {BadRequestException, Inject, Injectable} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AuthService} from "../auth.service";
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthOptions} from "@simple-auth/core";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<unknown>,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: authOptions.refresh.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        let data = request?.cookies[authOptions.refresh.cookie.name];
        if (!data) {
          return null;
        }
        return data.token
      }])
    })
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    let data = req?.cookies["auth-cookie"];
    if (!data?.refreshToken) {
      throw new BadRequestException('invalid refresh token');
    }
    let user = null//await this.userService.validRefreshToken(payload.email, data.refreshToken);
    if (!user) {
      throw new BadRequestException('token expired');
    }

    return user;
  }
}

