import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { PageNotFoundExceptionFilter } from 'system';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
}
bootstrap();
