import {DynamicModule, Module} from "@nestjs/common";
import {JwtModule, JwtModuleAsyncOptions, JwtService} from "@nestjs/jwt";
import {JwtSessionService} from "./jwt.constants";



@Module({})
export class JwtSessionModule {
  public static registerAsync(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      module: JwtSessionModule,
      imports: [
        ...options.imports ?? [],
        JwtModule.registerAsync(options)
      ],
      providers: [
        {
          provide: JwtSessionService,
          useExisting: JwtService,
        }
      ],
      exports: [
        JwtSessionService
      ]
    }
  }
}
