import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static configure(app: INestApplication, URL_Prefix: string): void {
    const swaggerConfig = this.initalDocumnet();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(URL_Prefix + '/api-doc', app, document);
  }

  private static initalDocumnet() {
    return new DocumentBuilder()
      .setTitle('Store API')
      .setDescription('The Store API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization for users',
        },
        'user',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization for admins',
        },
        'admin',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization for business',
        },
        'business',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization for customer',
        },
        'customer',
      )
      .build();
  }
}
