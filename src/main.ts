import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerFactory } from './swagger/swagger.factory';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have decorators
      forbidNonWhitelisted: true, // throws error if unknown values exist
      transform: true, // auto-transform payloads to DTO classes
    }),
  );
  app.enableCors({
    origin: '*', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies or authentication headers
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.useStaticAssets(join(__dirname, '..', 'Uploads'), {
    prefix: '/uploads/',
  });

  SwaggerFactory.setup(app, {
    title: 'Vaghtban API',
    description: 'API for managing reservations',
    version: '1.0',
    tag: 'reservations',
    bearerAuth: true,
    path: 'docs', // Custom path for Swagger UI,
  });
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
