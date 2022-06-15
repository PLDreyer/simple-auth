import {Controller, Post, Req, Res, UseGuards} from "@nestjs/common";
import {Request, Response} from "express";
import {LocalAuthGuard, RefreshAuthGuard} from "./guards";
import {AuthService} from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, req, res);
  }

  @Post("register")
  async register(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(req, res);
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  async refresh(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    return this.authService.refresh(req, res);
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
