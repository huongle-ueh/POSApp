/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Exchange Rate API')
    .setDescription(
      'Exchange Rate API for Money Exchange App Using Vietcombank Data'
    )
    .setVersion('1.0')
    .build();

  const globalPrefix = '';
  const document = SwaggerModule.createDocument(app, options);
  document.servers = [{ url: '/api/money-exchange' }];
  SwaggerModule.setup('swagger', app, document);
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS
  const corsOptions: CorsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.enableCors(corsOptions);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
