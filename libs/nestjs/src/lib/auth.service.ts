import {Inject, Injectable} from "@nestjs/common";
import {Request, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {AUTH_DATABASE_METHODS, AUTH_MODULE_OPTIONS} from "./constants";
import {JwtRefreshService, JwtSessionService} from "./jwt/jwt.constants";
import {generate} from 'rand-token';
import {
  AuthListException,
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
      expiresIn: 10,// this.authOptions.session.lifetime,
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
    console.log("NOT_IMPLEMENTED")
  }

  async refresh(req: Request, res: Response) {
    const user = await this.databaseMethods.findOneRefresh((req.user as unknown as { refresh: string }).refresh);
    if (!user) {
      const e = new InvalidJwtRefresh();
      throw new AuthListException([e]);
    }

    await this.databaseMethods.deleteOneRefresh((req.user as unknown as { refresh: string }).refresh);

    const sessionPayload = { sub: user.id, id: generate(32)  };
    await this.databaseMethods.saveOneSession(sessionPayload.id, user);
    const accessToken = this.jwtSessionService.sign(sessionPayload, {
      secret: this.authOptions.session.secret,
      expiresIn: 10,// this.authOptions.session.lifetime,
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

    if(this.authOptions.refresh.customResponse) {
      return this.authOptions.session.customResponse(req, res, accessToken, refreshToken);
    }

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }

  async logout(req: Request, res: Response) {
    console.log("NOT_IMPLEMENTED")
  }
}
