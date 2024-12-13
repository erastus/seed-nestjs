import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { PageNotFoundExceptionFilter } from 'system/exeptions/page-not-found-exception/page-not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

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

  app.setViewEngine('pug');
  app.setBaseViewsDir(path.join(__dirname, 'app', 'views'));

  app.useGlobalFilters(new PageNotFoundExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
