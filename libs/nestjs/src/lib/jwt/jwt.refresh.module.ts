import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions, JwtService } from '@nestjs/jwt';
import { JwtRefreshService } from './jwt.constants';

@Module({})
export class JwtRefreshModule {
  public static registerAsync(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      module: JwtRefreshModule,
      imports: [...(options.imports ?? []), JwtModule.registerAsync(options)],
      providers: [
        {
          provide: JwtRefreshService,
          useExisting: JwtService,
        },
      ],
      exports: [JwtRefreshService],
    };
  }
}
