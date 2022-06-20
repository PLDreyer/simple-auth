import {BadRequestException, Inject, Injectable} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AUTH_MODULE_OPTIONS} from "../constants";
import {
  AuthOptions,
  InvalidJwtRefresh,
  MalformedJwtRefresh,
} from "@simple-auth/core";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: authOptions.refresh.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        const cookieName = this.authOptions.refresh.cookie.name;
        const cookie =
          this.authOptions.refresh.cookie.signed ?
            req.signedCookies[cookieName] : req.cookies[cookieName];

        if(!cookie) return null;
        return cookie;
      }])
    })
  }

  async validate(payload: Record<string, unknown>) {
    if(!payload) return [null, new InvalidJwtRefresh()];

    if(payload.refresh === undefined) return [null, new MalformedJwtRefresh()];

    return payload;
  }
}

