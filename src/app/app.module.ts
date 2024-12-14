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
      // TODO: si es != production ? '..' : '' en rootPath: join(__dirname, '..', 'public')
      {
        serveRoot: '/',
        rootPath: join(__dirname, '..', '..', 'public'),
      }
    ),
    UserModule,
    ConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
