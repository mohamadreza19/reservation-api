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
  await app.listen(process.env.PORT || 3000);

  const { REDIS_SERVICE_NAME, REDIS_PORT } = process.env;

  // This will only work on Render hosted services
  const renderRedis = new Redis({
    // Use Render Redis service name as host, red-xxxxxxxxxxxxxxxxxxxx
    host: REDIS_SERVICE_NAME,
    // Default Redis port
    port: Number(REDIS_PORT) || 6379,
  });

  console.log('Connected to Render Redis! 🚀');

  renderRedis.set('animal', 'mouse');

  renderRedis.get('animal').then((result) => {
    console.log(`Result for key animal: ${result}`); // Prints "mouse"
  });

  renderRedis.del('animal');
}
bootstrap();
