import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  GeneralAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
  TwoFaAuthGuard,
} from './guards';
import { AuthService } from './auth.service';
import { AUTH_MODULE_OPTIONS } from './constants';
import { AuthOptions } from '@simple-auth/core';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
    private readonly authService: AuthService
  ) {}

  @UseGuards(GeneralAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    if (this.authOptions.endpoints.me?.enabled)
      return {
        NOT: 'IMPLEMENTED',
      };
  }

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

  @Post('register')
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.register(req, res);
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
