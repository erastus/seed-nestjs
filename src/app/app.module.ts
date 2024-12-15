import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import { AppConfigModule } from './features/app-config/app-config.module';
import { SystemModule } from 'system/system.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Paths } from './config/Paths';
import { Logger } from './config/logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SystemModule.forRoot(
      {
        loggerConfig: new Logger(),
        paths: new Paths()
      }
    ),
    ServeStaticModule.forRoot(
      {
        serveRoot: '/',
        rootPath: join(process.cwd(), 'public'),
      }
    ),
    UserModule,
    AppConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
