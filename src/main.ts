import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/app/app.module';
import { SwaggerConfig } from './shared/config/SwaggerConfig';
import { Logger, ValidationPipe } from '@nestjs/common';
import Redis from 'ioredis';
import { redisClient } from './shared/databases/redis-db.module';

async function bootstrap() {
  const URL_Prefix = '/api';
  const app = await NestFactory.create(AppModule);
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  app.setGlobalPrefix(URL_Prefix);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  SwaggerConfig.configure(app, URL_Prefix);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(Number(process.env.PORT) || 3000);

  const redis = redisClient;

  await redis.flushdb();
  setInterval(async () => {
    const date = new Date().toISOString();
    await redis.set(date, date);
    // console.log(data);
    console.log(await redis.get(date));
  }, 2000);
}
bootstrap();
