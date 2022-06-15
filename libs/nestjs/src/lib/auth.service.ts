import {Inject, Injectable} from "@nestjs/common";
import {Request, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {AUTH_DATABASE_METHODS, AUTH_MODULE_OPTIONS} from "./constants";
import {JwtRefreshService, JwtSessionService} from "./jwt/jwt.constants";
import {generate} from 'rand-token';
import {AuthOptions} from "@simple-auth/core";

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtSessionService)
    private readonly jwtSessionService: JwtService,
    @Inject(JwtRefreshService)
    private readonly jwtRefreshService: JwtService,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<any>,
    @Inject(AUTH_DATABASE_METHODS)
    private readonly databaseMethods: any,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.databaseMethods.findOneUser(username, pass);
  }

  async login(user: any, req: Request, res: Response) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtSessionService.sign(payload);
    res.cookie(
      this.authOptions.session.cookie.name,
      accessToken,
      this.authOptions.session.cookie,
    )

    if(this.authOptions.session.customResponse) {
      return this.authOptions.session.customResponse(req, res, accessToken);
    }

    res.json({
      success: true,
      accessToken,
    })
  }

  async register(req: Request, res: Response) {

  }

  async refresh(req: Request, res: Response) {
    const token = generate(32);
    const refreshToken = this.jwtRefreshService.sign(token);
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
