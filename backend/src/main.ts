/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';
// import * as dotenv from 'dotenv';
// dotenv.config();


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   Logger.log(
//     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
//   );
// }

// bootstrap();


import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Овде се овозможува CORS
  app.enableCors({
    origin: 'http://localhost:4200', // дозволи frontend адреса (замени ако е друга)
    credentials: true, // ако користиш cookies/auth headers
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

