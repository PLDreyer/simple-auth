import {BadRequestException, Inject, Injectable} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AuthService} from "../auth.service";
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthOptions, InvalidJwtSession, MalformedJwtSession} from "@simple-auth/core";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: authOptions.refresh.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        const cookieName = this.authOptions.session.cookie.name;
        const cookie =
          this.authOptions.session.cookie.signed ?
            req.signedCookies[cookieName] : req.cookies[cookieName];

        if(!cookie) return null;

        return cookie;
      }])
    })
  }

  async validate(payload: Record<string, unknown> | string) {
    if(!payload) return [null, new InvalidJwtSession()];

    if(typeof payload !== "object") return [null, new MalformedJwtSession()];

    const id = payload.id;
    if(!id) return [null, new MalformedJwtSession()];

    return payload;
  }
}

