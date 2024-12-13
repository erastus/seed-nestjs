import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      // TODO: si es != production ? '..' : '' en rootPath: join(__dirname, '..', 'public')
      {
        serveRoot: '/',
        rootPath: join(__dirname, '..', 'public'),
      }
    ),
    AppModule,
    SystemModule
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
