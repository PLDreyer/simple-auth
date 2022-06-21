import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

export const AUTH_MODULE_OPTIONS_USER = Symbol('AUTH_MODULE_OPTIONS_USER');

export const AUTH_MODULE_OPTIONS = Symbol('AUTH_MODULE_OPTIONS');

export type AsyncAuthOptions<U> = {
  imports?: Array<any>;
  useFactory?: (...args: Array<unknown>) => Promise<U> | U;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
};
