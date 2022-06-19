import {Inject, Injectable} from "@nestjs/common";
import {Request, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {AUTH_DATABASE_METHODS, AUTH_MODULE_OPTIONS} from "./constants";
import {JwtRefreshService, JwtSessionService} from "./jwt/jwt.constants";
import {generate} from 'rand-token';
import {
  AuthOptions,
  InvalidJwtRefresh,
  MissingJwtRefresh,
} from "@simple-auth/core";

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtSessionService)
    private readonly jwtSessionService: JwtService,
    @Inject(JwtRefreshService)
    private readonly jwtRefreshService: JwtService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
    @Inject(AUTH_DATABASE_METHODS)
    private readonly databaseMethods: any,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.databaseMethods.findOneUser(username, pass);
  }

  async login(user: Express.User, req: Request, res: Response) {
    const sessionPayload = { sub: user.id, id: generate(32)  };
    await this.databaseMethods.saveOneSession(sessionPayload.id, user);
    const accessToken = this.jwtSessionService.sign(sessionPayload, {
      secret: this.authOptions.session.secret,
      expiresIn: this.authOptions.session.lifetime,
    });

    const refreshPayload = { refresh: generate(32) };
    await this.databaseMethods.saveOneRefresh(refreshPayload.refresh, user);
    const refreshToken = this.jwtRefreshService.sign(refreshPayload, {
      secret: this.authOptions.refresh.secret,
      expiresIn: this.authOptions.refresh.lifetime,
    });

    res.cookie(
      this.authOptions.session.cookie.name,
      accessToken,
      this.authOptions.session.cookie,
    )

    res.cookie(
      this.authOptions.refresh.cookie.name,
      refreshToken,
      this.authOptions.refresh.cookie,
    )

    if(this.authOptions.session.customResponse) {
      return this.authOptions.session.customResponse(req, res, accessToken, refreshToken);
    }

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }

  async register(req: Request, res: Response) {

  }

  async refresh(req: Request, res: Response) {
    const cookie = req.cookies[
        this.authOptions.refresh.cookie.name
      ];
    if(!cookie) {
      const e = new MissingJwtRefresh();

      if(this.authOptions.error) {
        return this.authOptions.error(e);
      }

      throw e;
    }

    let refreshPayload;
    try {
      refreshPayload = await this.jwtRefreshService.verify(cookie);
    } catch(e) {
      if(this.authOptions.error) return this.authOptions.error(e);
    }

    const user = await this.databaseMethods.findOneRefresh(refreshPayload.refresh);
    if (!user) {
      const e = new InvalidJwtRefresh();

      if(this.authOptions.error) {
        return this.authOptions.error(e);
      }

      throw e;
    }

    await this.databaseMethods.deleteOneRefresh(refreshPayload.refresh);

    const token = generate(32);
    const refreshToken = this.jwtRefreshService.sign({
      refresh: token,
    });

    res.cookie(
      this.authOptions.refresh.cookie.name,
      refreshToken,
      this.authOptions.refresh.cookie,
    )

    if(this.authOptions.refresh.customResponse) {
      return this.authOptions.refresh.customResponse(req, res, refreshToken);
    }

    res.json({
      success: true,
      refreshToken,
    })
  }

  async logout(req: Request, res: Response) {

  }
}
