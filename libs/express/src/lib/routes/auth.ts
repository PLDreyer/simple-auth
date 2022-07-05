import { Application, Request, Response } from 'express';
import passport from 'passport';
import { extractHandler } from '../utils';
import { TwofaGuard } from '../guards/twofa.guard';

export const applyRoutes = (app: Application) => {
  app.post(
    '/auth/login',
    (req, res, next) => {
      passport.authenticate('local', (error, user) => {
        if (error) throw error;

        req.user = user;
        return next();
      })(req, res);
    },
    async (req: Request, res: Response) => {
      const rememberMe: boolean =
        req.body.rememberMe === undefined ? false : !!req.body.rememberMe;
      const handler = extractHandler(req.app);
      const result = await handler.setLogin(req.user, rememberMe);

      if (result.success) {
        res.cookie(handler.options.session.cookie.name, result.accessToken, {
          ...handler.options.session.cookie,
          expires: rememberMe
            ? new Date(
                Date.now() + handler.options.session.cookie.expires.getTime()
              )
            : undefined,
        });

        res.cookie(handler.options.refresh.cookie.name, result.refreshToken, {
          ...handler.options.refresh.cookie,
          expires: rememberMe
            ? new Date(
                Date.now() + handler.options.refresh.cookie.expires.getTime()
              )
            : undefined,
        });
      }

      return res.json(result);
    }
  );

  app.post('/auth/twofa', TwofaGuard(), async (req: Request, res: Response) => {
    const handler = extractHandler(req.app);
    console.log('req.user: ', req.user);
    const rememberMe = (req.user as any)._REMEMBER_ME as string;
    const result = await handler.setTwofa(req.user as any);

    if (result.success) {
      res.cookie(handler.options.session.cookie.name, result.accessToken, {
        ...handler.options.session.cookie,
        expires: rememberMe
          ? new Date(
              Date.now() + handler.options.session.cookie.expires.getTime()
            )
          : undefined,
      });

      res.cookie(handler.options.refresh.cookie.name, result.refreshToken, {
        ...handler.options.refresh.cookie,
        expires: rememberMe
          ? new Date(
              Date.now() + handler.options.refresh.cookie.expires.getTime()
            )
          : undefined,
      });
    }

    return res.json(result);
  });

  app.post(
    '/auth/refresh',
    (req: Request, res: Response, next) => {
      passport.authenticate('refresh', (error, user) => {
        if (error) throw error;

        req.user = user;
        return next();
      })(req, res);
    },
    async (req: Request, res: Response) => {
      const handler = extractHandler(req.app);
      const rememberMe = (req.user as any)._REMEMBER_ME as string;
      const result = await handler.setRefresh(req.user as any);

      if (result.success) {
        res.cookie(handler.options.session.cookie.name, result.accessToken, {
          ...handler.options.session.cookie,
          expires: rememberMe
            ? new Date(
                Date.now() + handler.options.session.cookie.expires.getTime()
              )
            : undefined,
        });

        res.cookie(handler.options.refresh.cookie.name, result.refreshToken, {
          ...handler.options.refresh.cookie,
          expires: rememberMe
            ? new Date(
                Date.now() + handler.options.refresh.cookie.expires.getTime()
              )
            : undefined,
        });
      }

      return res.json(result);
    }
  );
};
