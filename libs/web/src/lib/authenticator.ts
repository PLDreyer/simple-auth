import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  DEFAULT_PASSWORD_FIELD,
  DEFAULT_USERNAME_FIELD,
  DefaultLoginResponse,
  DefaultRefreshResponse,
  DefaultTwoFaResponse,
  LoginRequest,
  TwoFaRequest,
  RefreshRequest,
} from '@simple-auth/types';

export type AuthenticatorOptions = {
  usernameField?: string;
  passwordField?: string;
};

export class Authenticator {
  private readonly _instance: AxiosInstance;
  public readonly axios: AxiosInstance;

  constructor(
    private readonly url: string,
    private readonly options?: AuthenticatorOptions
  ) {
    this._instance = axios.create();
    this._instance.defaults.url = this.url;
    this._instance.defaults.withCredentials = true;
    this.axios = axios.create();
    this.axios.defaults.url = this.url;
    this.axios.defaults.withCredentials = true;
    this.axios.interceptors.response.use(this.handleHandshake.bind(this));
  }

  protected async handleHandshake(res: AxiosResponse): Promise<AxiosResponse> {
    console.log('res: ', res);
    if (res.data.error && res.data.error === 'access token expired') {
      await this.refresh();
      return this.axios(res.config);
    }

    return res;
  }

  public async login<T = DefaultLoginResponse>(
    username: string,
    password: string,
    rememberMe: boolean
  ) {
    const data: LoginRequest = {
      [this.options?.usernameField ?? DEFAULT_USERNAME_FIELD]: username,
      [this.options?.passwordField ?? DEFAULT_PASSWORD_FIELD]: password,
      rememberMe: rememberMe,
    };
    return this._instance.post<LoginRequest, T>(`${this.url}/auth/login`, data);
  }

  public async twofa<T = DefaultTwoFaResponse>(token: string, code: string) {
    const data: TwoFaRequest = {
      token,
      code,
    };
    return this._instance.post<TwoFaRequest, T>(`${this.url}/auth/twofa`, data);
  }

  public async refresh<T = DefaultRefreshResponse>() {
    return this._instance.post<RefreshRequest, T>(
      `${this.url}/auth/refresh`,
      {}
    );
  }
}
