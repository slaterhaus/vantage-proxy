import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';


import { configDotenv } from 'dotenv';
import { AppModule } from './app/app.module';

configDotenv();

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const origin = process.env.ALLOWED_ORIGIN || `http://localhost:${port}`;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept'
    }
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
