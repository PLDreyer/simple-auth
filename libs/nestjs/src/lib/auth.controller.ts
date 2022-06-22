import { Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard, RefreshAuthGuard, TwoFaAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { AUTH_MODULE_OPTIONS } from './constants';
import { AuthOptions } from '@simple-auth/core';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions<Express.User>,
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, req, res);
  }

  @UseGuards(TwoFaAuthGuard)
  @Post('twofa')
  async twoFa(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.twoFa(req.user, req, res);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
