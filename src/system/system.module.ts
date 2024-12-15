import { DynamicModule, Global, Module } from '@nestjs/common';
import { Logger } from './index';
import { Path, LoggerConfig } from './interfaces';
import { Bootstrap } from './bootstrap';

@Global()
@Module({})
export class SystemModule {
  private static isInitialized = false;
  static forRoot(options: { loggerConfig: LoggerConfig, paths: Path }): DynamicModule {
    if (SystemModule.isInitialized) {
      throw new Error('SystemModuleCreated.forRoot imported to many time');
    }

    SystemModule.isInitialized = true;

    return {
      module: SystemModule,
      providers: [
        {
          provide: 'APP_PATHS',
          useValue: options.paths,
        },
        {
          provide: 'LOGGER_CONFIG',
          useValue: options.loggerConfig,
        },
        {
          provide: 'NESTJS_DEBUG',
          useValue: String(process.env.NESTJS_DEBUG).toLowerCase() == 'true',
        },
        Bootstrap,
        Logger
      ],
      exports: [Logger],
    };
  }
}
