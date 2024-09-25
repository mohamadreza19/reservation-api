import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './shared/config/SwaggerConfig';
import { ValidationPipe } from '@nestjs/common';

const URL_Prefix = '/v1/api';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
