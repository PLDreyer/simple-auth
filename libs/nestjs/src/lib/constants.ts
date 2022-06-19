import {InjectionToken, OptionalFactoryDependency} from "@nestjs/common";

export const jwtConstants = {
  secret: 'secretKey',
};

export const cookieConstants = {
  name: 'auth-token'
}

export const AUTH_MODULE_OPTIONS_USER = Symbol("AUTH_MODULE_OPTIONS_USER");

export const AUTH_MODULE_OPTIONS = Symbol("AUTH_MODULE_OPTIONS");

export const AUTH_DATABASE_METHODS = Symbol("AUTH_DATABASE_OPTIONS");

export const AUTH_JWT_OPTIONS = Symbol("AUTH_JWT_OPTIONS");

export const AUTH_KEY_OPTIONS = Symbol("AUTH_KEY_OPTIONS");

export type AsyncAuthOptions<U> = {
  imports?: Array<any>,
  useFactory?: (...args: Array<unknown>) => Promise<U> | U,
  inject?: Array<InjectionToken | OptionalFactoryDependency>,
}

