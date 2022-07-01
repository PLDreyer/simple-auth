import { DynamicModule, Inject, Module, NestModule } from '@nestjs/common';
import { ModulesContainer, RouterModule, Routes } from '@nestjs/core';
import { AUTH_MODULE_OPTIONS } from './constants';
import { AuthOptions } from '@simple-auth/core';
import { INSTANCE_METADATA_SYMBOL } from '@nestjs/core/injector/instance-wrapper';
import { AuthController } from './auth.controller';

@Module({})
export class DynamicRouterModule {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authOptions: AuthOptions,
    private readonly modulesContainer: ModulesContainer
  ) {
    [...modulesContainer.entries()].forEach(([modId, modItem]) => {
      (modItem as any)._controllers.delete(AuthController);
    });
  }

  public static forRoot(options: any): DynamicModule {
    return {
      module: DynamicRouterModule,
      imports: [...(options.imports || [])],
    };
  }
}
