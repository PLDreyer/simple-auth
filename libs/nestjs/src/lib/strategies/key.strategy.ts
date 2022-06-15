import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-custom";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";

@Injectable()
export class KeyStrategy extends PassportStrategy(Strategy,'key') {
  constructor(){
    super();
  }

  async validate(req: Request, done: (...args: Array<unknown>) => void){
    return done(null, null);
  }
}
