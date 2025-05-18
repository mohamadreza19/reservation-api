import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerFactory } from './swagger/swagger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerFactory.setup(app, {
    title: 'Vaghtban API',
    description: 'API for managing reservations',
    version: '1.0',
    tag: 'reservations',
    bearerAuth: true,
    path: 'docs', // Custom path for Swagger UI
  });
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
