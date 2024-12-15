import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { PageNotFoundExceptionFilter } from 'system';
import { Logger } from 'system';
import * as configLogger from './app/config/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const log = new Logger(new configLogger.Logger(), String(process.env.NESTJS_DEBUG).toLowerCase() == 'true');
  log.setContext('restartedMain');

  log.info(`The following profile is active: "${process.env.NODE_ENV}"`);

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.engine('pug', require('pug').__express);
  app.setViewEngine('pug');
  app.setBaseViewsDir(path.join(process.cwd()));

  app.useGlobalFilters(new PageNotFoundExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  log.info(`App running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
