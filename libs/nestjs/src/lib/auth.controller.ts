import { Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard, RefreshAuthGuard, TwoFaAuthGuard } from './guards';
import { AUTH_HANDLER } from './constants';
import { Handler } from '@simple-auth/core';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_HANDLER)
    private readonly authHandler: Handler<Express.User, Request, Response>
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rememberMe: boolean =
      req.body.rememberMe === undefined ? false : !!req.body.rememberMe;
    const result = await this.authHandler.setLogin(req.user, rememberMe);

    if (result.success) {
      res.cookie(
        this.authHandler.options.session.cookie.name,
        result.accessToken,
        {
          ...this.authHandler.options.session.cookie,
          expires: rememberMe
            ? new Date(
                Date.now() +
                  this.authHandler.options.session.cookie.expires.getTime()
              )
            : undefined,
        }
      );

      res.cookie(
        this.authHandler.options.refresh.cookie.name,
        result.refreshToken,
        {
          ...this.authHandler.options.refresh.cookie,
          expires: rememberMe
            ? new Date(
                Date.now() +
                  this.authHandler.options.refresh.cookie.expires.getTime()
              )
            : undefined,
        }
      );
    }

    return result;
  }

  @UseGuards(TwoFaAuthGuard)
  @Post('twofa')
  async twoFa(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.authHandler.setTwofa(
      req.user as unknown as Express.User & {
        _REMEMBER_ME: boolean;
        _TWOFA_CODE: string;
      }
    );

    if (result.success) {
      res.cookie(
        this.authHandler.options.session.cookie.name,
        result.accessToken,
        {
          ...this.authHandler.options.session.cookie,
          expires: result.rememberMe
            ? new Date(
                Date.now() +
                  this.authHandler.options.session.cookie.expires.getTime()
              )
            : undefined,
        }
      );

      res.cookie(
        this.authHandler.options.refresh.cookie.name,
        result.refreshToken,
        {
          ...this.authHandler.options.refresh.cookie,
          expires: result.rememberMe
            ? new Date(
                Date.now() +
                  this.authHandler.options.refresh.cookie.expires.getTime()
              )
            : undefined,
        }
      );
    }

    return result;
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authHandler.setRefresh(
      req.user as unknown as Express.User & {
        _REFRESH_TOKEN: string;
        _REMEMBER_ME: boolean;
      }
    );

    if (result.success) {
      res.cookie(
        this.authHandler.options.session.cookie.name,
        result.accessToken,
        {
          ...this.authHandler.options.session.cookie,
          expires: result.rememberMe
            ? new Date(
                Date.now() +
                  this.authHandler.options.session.cookie.expires.getTime()
              )
            : undefined,
        }
      );

      res.cookie(
        this.authHandler.options.refresh.cookie.name,
        result.refreshToken,
        {
          ...this.authHandler.options.refresh.cookie,
          expires: result.rememberMe
            ? new Date(
                Date.now() +
                  this.authHandler.options.refresh.cookie.expires.getTime()
              )
            : undefined,
        }
      );
    }

    return result;
  }
}
