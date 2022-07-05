import type { Application, Request, Response } from 'express';
import { extractHandler } from '../utils';
import { TwofaGuard } from '../guards/twofa.guard';
import { LocalGuard } from '../guards/local.guard';
import { RefreshGuard } from '../guards/refresh.guard';

export const applyRoutes = (app: Application) => {
  app.post('/auth/login', LocalGuard(), async (req: Request, res: Response) => {
    const rememberMe: boolean =
      req.body.rememberMe === undefined ? false : !!req.body.rememberMe;
    const handler = extractHandler(req.app);
    const result = await handler.setLogin(req.user, rememberMe);

    if (result.success) {
      handleSuccess(
        res,
        handler.options.session.cookie.name,
        result.accessToken,
        handler.options.session.cookie,
        rememberMe
      );
      handleSuccess(
        res,
        handler.options.refresh.cookie.name,
        result.refreshToken,
        handler.options.refresh.cookie,
        rememberMe
      );
    }

    return res.json(result);
  });

  app.post('/auth/twofa', TwofaGuard(), async (req: Request, res: Response) => {
    const handler = extractHandler(req.app);
    console.log('req.user: ', req.user);
    const rememberMe = (req.user as any)._REMEMBER_ME as boolean;
    const result = await handler.setTwofa(req.user as any);

    if (result.success) {
      handleSuccess(
        res,
        handler.options.session.cookie.name,
        result.accessToken,
        handler.options.session.cookie,
        rememberMe
      );
      handleSuccess(
        res,
        handler.options.refresh.cookie.name,
        result.refreshToken,
        handler.options.refresh.cookie,
        rememberMe
      );
    }

    return res.json(result);
  });

  app.post(
    '/auth/refresh',
    RefreshGuard(),
    async (req: Request, res: Response) => {
      const handler = extractHandler(req.app);
      const rememberMe = (req.user as any)._REMEMBER_ME as boolean;
      const result = await handler.setRefresh(req.user as any);

      if (result.success) {
        handleSuccess(
          res,
          handler.options.session.cookie.name,
          result.accessToken,
          handler.options.session.cookie,
          rememberMe
        );
        handleSuccess(
          res,
          handler.options.refresh.cookie.name,
          result.refreshToken,
          handler.options.refresh.cookie,
          rememberMe
        );
      }

      return res.json(result);
    }
  );
};

function handleSuccess(
  res: Response,
  cookieName: string,
  cookieValue: string,
  cookieOptions: any,
  rememberMe: boolean
) {
  res.cookie(cookieName, cookieValue, {
    ...cookieOptions,
    expires: rememberMe
      ? new Date(Date.now() + cookieOptions.expires.getTime())
      : undefined,
  });
}
