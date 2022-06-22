import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export const AUTH_MODULE_OPTIONS_USER = Symbol('AUTH_MODULE_OPTIONS_USER');

export const AUTH_MODULE_OPTIONS = Symbol('AUTH_MODULE_OPTIONS');

export type AsyncAuthOptions<U> = {
  imports?: Array<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>
  >;
  useFactory?: (...args: Array<unknown>) => Promise<U> | U;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
};
