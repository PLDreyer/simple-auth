import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AUTH_MODULE_OPTIONS} from "../constants";
import {AuthOptions} from "@simple-auth/core";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<any>,
  ){
    super({
      ignoreExpiration: false,
      secretOrKey: authOptions.session.secret,
      jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
        let data = request?.cookies[authOptions.session.cookie.name];

        if(!data){
          return null;
        }
        return data
      }])
    });
  }

  async validate(payload:any, done: (...args: Array<unknown>) => unknown){
    if(payload === null){
      throw new UnauthorizedException();
    }
    return payload;
  }
}
