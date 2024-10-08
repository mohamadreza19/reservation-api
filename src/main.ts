import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/app/app.module';
import { SwaggerConfig } from './shared/config/SwaggerConfig';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const URL_Prefix = '/api';
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable logs at different levels
  });
  app.setGlobalPrefix(URL_Prefix);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  SwaggerConfig.configure(app, URL_Prefix);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
