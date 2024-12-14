import { DynamicModule, Global, Module } from '@nestjs/common';
import { Logger } from './index';
import { Path } from './interfaces/path/path.interface';
import { Bootstrap } from './bootstrap';

@Global()
@Module({})
export class SystemModule {
  private static isInitialized = false;
  static forRoot(options: { paths: Path }): DynamicModule {
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
        Bootstrap,
        Logger
      ],
      exports: [Logger],
    };
  }
}
