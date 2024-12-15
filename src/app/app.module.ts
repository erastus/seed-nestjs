import { Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { ConfigModule } from './features/config/config.module';
import { SystemModule } from 'system/system.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Paths } from './config/Paths';

@Module({
  imports: [
    SystemModule.forRoot(
      {
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
    ConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
