import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/app/app.module';
import { SwaggerConfig } from './shared/config/SwaggerConfig';
import { Logger, ValidationPipe } from '@nestjs/common';
import Redis from 'ioredis';

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

  // This will only work on Render hosted services
  // const renderRedis = new Redis({
  //   username: 'default', // Render Redis name, red-xxxxxxxxxxxxxxxxxxxx
  //   host: 'communal-puma-21946.upstash.io', // Render Redis hostname, REGION-redis.render.com
  //   password: 'AVW6AAIjcDE4ZDRiZWRkYTVmNjg0ZWNjOGQzMzE1OGUyNjYyZWU2ZHAxMA', // Provided password
  //   port: Number(process.env.REDIS_PORT) || 6379, // Connection port
  //   tls: {
  //     rejectUnauthorized: true,
  //   }, // TLS required when externally connecting to Render Redis
  // });
  // const renderRedis = new Redis({
  //   host: process.env.REDIS_SERVICE_NAME, // Render Redis service name, red-xxxxxxxxxxxxxxxxxxxx
  //   port: Number(process.env.REDIS_PORT) || 6379, // Redis port
  // });

  // const data = await renderRedis.set('foo', 'bar');

  // setInterval(async () => {
  //   console.log(data);
  //   console.log(await renderRedis.get('foo'));
  // }, 2000);
}
bootstrap();
