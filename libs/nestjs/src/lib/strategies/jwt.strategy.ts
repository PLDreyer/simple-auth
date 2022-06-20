import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthOptions, InvalidJwtSession, MalformedJwtSession, MissingUser} from "@simple-auth/core";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
  ){
    super({
      ignoreExpiration: false,
      secretOrKey: authOptions.session.secret,
      jwtFromRequest:ExtractJwt.fromExtractors([(req:Request) => {
        const cookieName = this.authOptions.session.cookie.name;
        const cookie =
          this.authOptions.session.cookie.signed ?
            req.signedCookies[cookieName] : req.cookies[cookieName];

        if(!cookie) return null;

        return cookie;
      }])
    });
  }

  /**
   * @param payload
   * @returns user, info, status
   */
  async validate(payload: Record<string, unknown> | string){
    if(!payload) return [null, new InvalidJwtSession()];

    if(typeof payload !== "object") return [null, new MalformedJwtSession()];

    const id = payload.id as string;
    if(!id) return [null, new MalformedJwtSession()];

    const user = await this.authOptions.session.find(id);
    if(!user) return [null, new MissingUser()];

    return user;
  }
}
