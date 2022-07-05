import {
  AuthOptions,
  EXPIRED_JWT_SESSION,
  EXPIRED_JWT_REFRESH,
  INTERNAL_AUTH_ERROR,
  INVALID_JWT_SESSION,
  MALFORMED_JWT_SESSION,
  MALFORMED_JWT_REFRESH,
  INVALID_JWT_REFRESH,
  MISSING_JWT_REFRESH,
  MISSING_JWT_SESSION,
  MISSING_API_KEY,
  INVALID_API_KEY,
  DEFAULT_USERNAME_FIELD,
  DEFAULT_PASSWORD_FIELD,
  MISSING_USER_CREDENTIALS,
  INVALID_USER_CREDENTIALS,
  MISSING_TWOFA_TOKEN,
  MISSING_TWOFA_CODE,
  INVALID_TWOFA_TOKEN,
  INVALID_TWOFA_CODE,
  TwoFaCode,
} from '@simple-auth/types';
import { verify, sign, TokenExpiredError } from 'jsonwebtoken';
import { generate } from 'rand-token';

type LogMethod = (msg: string) => void;

interface Logger {
  log: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  debug: LogMethod;
}

export class Handler<U extends { id: string }, I, R> {
  private readonly authOptions: AuthOptions<U, I, R>;

  constructor(
    authOptions: AuthOptions<U, I, R>,
    private readonly logger: Logger
  ) {
    this.authOptions = this.sanitizeAuthOptions(authOptions);
  }

  public get options() {
    return this.authOptions;
  }

  public async getUserWithSessionJwt(
    jwt: string | undefined
  ): Promise<[U | null, string | null]> {
    if (!jwt) return [null, MISSING_JWT_SESSION];

    let payload;

    try {
      payload = await this.getUserWithJwt(jwt, this.authOptions.session.secret);
    } catch (e) {
      if (e instanceof TokenExpiredError) return [null, EXPIRED_JWT_SESSION];

      this.logger.warn(`Unhandled error occurred: ${e}`);
      return [null, INTERNAL_AUTH_ERROR];
    }

    if (typeof payload === 'string') return [null, MALFORMED_JWT_SESSION];

    if (!payload['id']) return [null, INVALID_JWT_SESSION];

    if (typeof payload['id'] !== 'string') return [null, MALFORMED_JWT_SESSION];

    const user = await this.authOptions.session.find(payload['id']);
    if (!user) return [null, INVALID_JWT_SESSION];

    return [user, null];
  }

  public async getUserWithRefreshJwt(
    jwt: string | undefined
  ): Promise<[U | null, string | null]> {
    if (!jwt) return [null, MISSING_JWT_REFRESH];

    let payload;

    try {
      payload = await this.getUserWithJwt(jwt, this.authOptions.refresh.secret);
    } catch (e) {
      if (e instanceof TokenExpiredError) return [null, EXPIRED_JWT_REFRESH];

      this.logger.warn(`Unhandled error occurred: ${e}`);
      return [null, INTERNAL_AUTH_ERROR];
    }

    if (typeof payload === 'string') return [null, MALFORMED_JWT_REFRESH];

    if (!payload['id']) return [null, INVALID_JWT_REFRESH];

    if (typeof payload['id'] !== 'string') return [null, MALFORMED_JWT_REFRESH];

    const user = await this.authOptions.refresh.find(payload['id']);
    if (!user) return [null, INVALID_JWT_REFRESH];

    return [
      {
        ...user.user,
        _REFRESH_TOKEN: payload['id'],
        _REMEMBER_ME: user.rememberMe,
      },
      null,
    ];
  }

  public async getUserWithApiKey(apiKey: string | undefined) {
    if (!apiKey) return [null, MISSING_API_KEY];

    const user = await this.authOptions.apiKey?.find(apiKey);
    if (!user) return [null, INVALID_API_KEY];

    return [user, null];
  }

  public async getUserWithCredentials(body: Record<string, unknown>) {
    const { usernameField, passwordField } = this.authOptions.login;
    const username = body[usernameField ?? DEFAULT_USERNAME_FIELD];
    const password = body[passwordField ?? DEFAULT_PASSWORD_FIELD];

    if (!username || !password) return [null, MISSING_USER_CREDENTIALS];

    if (typeof username !== 'string' || typeof password !== 'string')
      return [null, INVALID_USER_CREDENTIALS];

    const user = await this.authOptions.login.find(username, password);

    if (!user) return [null, INVALID_USER_CREDENTIALS];

    return [user, null];
  }

  public async getUserWithTwoFa(body: Record<string, unknown>) {
    const token = body['token'];
    if (!token) return [null, MISSING_TWOFA_TOKEN];
    if (typeof token !== 'string') return [null, INVALID_TWOFA_TOKEN];

    const code = body['code'];
    if (!code) return [null, MISSING_TWOFA_CODE];
    if (typeof code !== 'string') return [null, INVALID_TWOFA_CODE];

    const user = await this.authOptions.login.twoFa?.findTwoFaSessionToken(
      token
    );
    if (!user) return [null, INVALID_TWOFA_TOKEN];

    return [
      {
        ...user.user,
        _TWOFA_CODE: new TwoFaCode(code),
        _REMEMBER_ME: user.rememberMe,
      },
      null,
    ];
  }

  public async setLogin(user: U, rememberMe: boolean) {
    const shouldHandle2Fa =
      await this.authOptions.login.twoFa?.shouldValidateTwoFa(user);
    if (shouldHandle2Fa) {
      const twofaToken = generate(32);
      await this.authOptions.login.twoFa?.saveTwoFaSessionToken(
        twofaToken,
        user,
        rememberMe
      );

      return {
        success: false,
        info: 'twofa required',
        token: twofaToken,
        accessToken: undefined,
        refreshToken: undefined,
      };
    }

    const accessToken = await this.createSessionJwt(user, rememberMe);
    const refreshToken = await this.createRefreshJwt(user, rememberMe);
    return {
      success: true,
      info: undefined,
      accessToken,
      refreshToken,
    };
  }

  public async setTwofa(
    user: U & { _TWOFA_CODE: string; _REMEMBER_ME: boolean }
  ) {
    const code: string = user._TWOFA_CODE;
    const rememberMe: boolean = user._REMEMBER_ME;

    if (!code)
      return {
        success: false,
        info: MISSING_TWOFA_CODE,
        accessToken: undefined,
        refreshToken: undefined,
        rememberMe: undefined,
      };

    if (rememberMe === undefined)
      return {
        success: false,
        // TODO missing rememberMe as const
        info: 'Missing RememberMe',
        accessToken: undefined,
        refreshToken: undefined,
        rememberMe: undefined,
      };

    const isValidCode = await this.authOptions.login.twoFa?.validateTwoFaCode(
      code
    );

    if (!isValidCode)
      return {
        success: false,
        info: INVALID_TWOFA_CODE,
        accessToken: undefined,
        refreshToken: undefined,
        rememberMe: undefined,
      };

    const accessToken = await this.createSessionJwt(user, rememberMe);
    const refreshToken = await this.createRefreshJwt(user, rememberMe);

    return {
      success: true,
      info: undefined,
      accessToken,
      refreshToken,
      rememberMe,
    };
  }

  public async setRefresh(
    patchedUser: U & { _REFRESH_TOKEN: string; _REMEMBER_ME: boolean }
  ) {
    const {
      _REMEMBER_ME: rememberMe,
      _REFRESH_TOKEN: refreshId,
      ...user
    } = patchedUser;

    if (!refreshId || rememberMe === undefined)
      return {
        success: false,
        info: INTERNAL_AUTH_ERROR,
        accessToken: undefined,
        refreshToken: undefined,
        rememberMe: undefined,
      };

    await this.authOptions.refresh.delete(refreshId);

    const accessToken = await this.createSessionJwt(
      user as unknown as U,
      rememberMe
    );
    const refreshToken = await this.createRefreshJwt(
      user as unknown as U,
      rememberMe
    );

    return {
      success: true,
      info: undefined,
      accessToken,
      refreshToken,
      rememberMe,
    };
  }

  private async getUserWithJwt(jwt: string, secret: string) {
    return verify(jwt, secret, { ignoreExpiration: false });
  }

  private async createSessionJwt(user: U, rememberMe: boolean) {
    const sessionPayload = { sub: user.id, id: generate(32) };
    await this.authOptions.session.save(sessionPayload.id, user);

    const accessToken = sign(sessionPayload, this.authOptions.session.secret, {
      expiresIn: this.authOptions.session.lifetime,
    });

    // TODO how to handle cookie management ?

    return accessToken;
  }

  private async createRefreshJwt(user: U, rememberMe: boolean) {
    const refreshPayload = { id: generate(32) };
    await this.authOptions.refresh.save(refreshPayload.id, user, rememberMe);

    const refreshToken = sign(refreshPayload, this.authOptions.refresh.secret, {
      expiresIn: this.authOptions.refresh.lifetime,
    });

    // TODO how to handle cookie management ?

    return refreshToken;
  }

  private sanitizeAuthOptions(
    options: AuthOptions<U, I, R>
  ): AuthOptions<U, I, R> {
    return {
      apiKey: this.verifyApiKeyOptions(options.apiKey),
      login: this.verifyLoginOptions(options.login),
      session: this.verifySessionOptions(options.session),
      refresh: this.verifyRefreshOptions(options.refresh),
      parser: options.parser || {},
      error: options.error,
    };
  }

  private verifyApiKeyOptions(
    keyOptions: AuthOptions<U, I, R>['apiKey']
  ): AuthOptions<U, I, R>['apiKey'] {
    return keyOptions;
  }

  private verifyLoginOptions(
    loginOptions: AuthOptions<U, I, R>['login']
  ): AuthOptions<U, I, R>['login'] {
    return {
      usernameField: loginOptions.usernameField ?? DEFAULT_USERNAME_FIELD,
      passwordField: loginOptions.passwordField ?? DEFAULT_PASSWORD_FIELD,
      find: loginOptions.find,
      twoFa: loginOptions.twoFa,
      customResponse: loginOptions.customResponse,
    };
  }

  private verifySessionOptions(
    sessionOptions: AuthOptions<U, I, R>['session']
  ): AuthOptions<U, I, R>['session'] {
    return {
      find: sessionOptions.find,
      save: sessionOptions.save,
      delete: sessionOptions.delete,
      cookie: {
        name: sessionOptions.cookie?.name ?? 'session',
        secure: sessionOptions.cookie?.secure ?? true,
        signed: sessionOptions.cookie?.signed ?? true,
        httpOnly: sessionOptions.cookie?.httpOnly ?? true,
        domain: sessionOptions.cookie?.domain ?? undefined,
        path: sessionOptions.cookie?.path ?? undefined,
        expires:
          sessionOptions.cookie?.expires ??
          new Date(
            sessionOptions.lifetime
              ? sessionOptions.lifetime * 1000
              : 15 * 60 * 1000
          ),
        sameSite: sessionOptions.cookie?.sameSite ?? 'lax',
      },
      lifetime: sessionOptions.lifetime ?? 15 * 60, // 15 minutes
      encrypted: sessionOptions.encrypted ?? false,
      secret: sessionOptions.secret,
      customResponse: sessionOptions.customResponse ?? undefined,
    };
  }

  private verifyRefreshOptions(
    refreshOptions: AuthOptions<U, I, R>['refresh']
  ): AuthOptions<U, I, R>['refresh'] {
    return {
      find: refreshOptions.find,
      save: refreshOptions.save,
      delete: refreshOptions.delete,
      cookie: {
        name: refreshOptions.cookie?.name ?? 'refresh',
        secure: refreshOptions.cookie?.secure ?? true,
        signed: refreshOptions.cookie?.signed ?? true,
        httpOnly: refreshOptions.cookie?.httpOnly ?? true,
        domain: refreshOptions.cookie?.domain ?? undefined,
        path: refreshOptions.cookie?.path ?? undefined,
        expires:
          refreshOptions.cookie?.expires ??
          new Date(
            refreshOptions.lifetime
              ? refreshOptions.lifetime * 1000
              : 14 * 24 * 60 * 60 * 1000
          ),
        sameSite: refreshOptions.cookie?.sameSite ?? 'lax',
      },
      lifetime: refreshOptions.lifetime ?? 14 * 24 * 60 * 60, // 14 days
      secret: refreshOptions.secret,
      customResponse: refreshOptions.customResponse ?? undefined,
    };
  }
}
