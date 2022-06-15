import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-custom";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AUTH_DATABASE_METHODS} from "../constants";

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy,'anonymous') {
  constructor(
    @Inject(AUTH_DATABASE_METHODS)
    private readonly databaseMethods: any,
  ){
    super();
  }

  async validate(req: Request){
    if(!req.user) {
      console.log("no user found")
    }

    return null;
  }
}
