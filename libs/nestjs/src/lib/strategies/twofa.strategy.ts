import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-custom";
import {PassportStrategy} from "@nestjs/passport";

@Injectable()
export class TwofaStrategy extends PassportStrategy(Strategy,'twofa') {
  constructor(){
    super({
    });
  }

  async validate(payload:any){
    if(payload === null){
      throw new UnauthorizedException();
    }
    return payload;
  }
}
