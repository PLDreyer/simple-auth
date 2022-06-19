import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-custom";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {AuthOptions, INVALID_API_KEY, InvalidApiKey, MissingApiKey} from "@simple-auth/core";
import {AUTH_MODULE_OPTIONS} from "../constants";

@Injectable()
export class KeyStrategy extends PassportStrategy(Strategy,'key') {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions
  ){
    super();
  }

  /**
   *
   * @param req
   * @param done
   * @returns user, info, status
   */
  async validate(req: Request, done: (...args: Array<unknown>) => void){
    const apiKey = this.getApiKeyFromFields(req);
    if(!apiKey) return [null, new MissingApiKey()];

    const user = await this.authOptions.apiKey.find(apiKey);
    if(!user) return [null, new InvalidApiKey()];

    return user;
  }

  private getApiKeyFromFields(req: Request): string | undefined {
    const { header, query, body } = this.authOptions.apiKey;

    for (const name of header.names) {
      const headerValue = req.header(name);

      if(headerValue && headerValue.length > 1) throw new Error("Found multiple api keys for header");

      if(headerValue) return headerValue[0];
    }

    for (const name of query.names) {
      const queryValue = req.query[name];

      if(Array.isArray(queryValue)) throw new Error("Found multiple api keys for query");
      if(typeof queryValue === "object" || queryValue === null) throw new Error("Found object for api key");

      if(queryValue) return queryValue;
    }

    for (const name of body.names) {
      const bodyValue = req.body[name];
      if(bodyValue) return bodyValue;
    }

    return undefined;
  }
}
