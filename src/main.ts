import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/app/app.module';
import { SwaggerConfig } from './shared/config/SwaggerConfig';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const URL_Prefix = '/api';
  // const app = await NestFactory.create(AppModule);
  // app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  // app.setGlobalPrefix(URL_Prefix);
  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  //   credentials: true,
  // });

  // SwaggerConfig.configure(app, URL_Prefix);

  // app.useGlobalPipes(new ValidationPipe());
  // await app.listen(process.env.PORT || 3000);

  const Redis = require('ioredis');

  // Internal Redis URL, extract the details into environment variables.
  // "redis://red-xxxxxxxxxxxxxxxxxxxx:6379"

  const renderRedis = new Redis({
    host: 'red-csgen9g8fa8c73fvqc80', // Render Redis service name, red-xxxxxxxxxxxxxxxxxxxx
    port: 6379, // Redis port
  });
  console.log(renderRedis);
}
bootstrap();
