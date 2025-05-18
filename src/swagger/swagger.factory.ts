// src/swagger/swagger.factory.ts
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class SwaggerFactory {
  static setup(
    app: INestApplication,
    config: {
      title: string;
      description: string;
      version: string;
      tag?: string;
      bearerAuth?: boolean;
      path?: string;
    },
  ) {
    const builder = new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(config.description)
      .setVersion(config.version);

    if (config.tag) {
      builder.addTag(config.tag);
    }

    if (config.bearerAuth) {
      builder.addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'JWT-auth',
      );
    }

    const documentOptions: SwaggerDocumentOptions = {
      ignoreGlobalPrefix: false,
      deepScanRoutes: true,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: `${config.title} API Documentation`,
    };

    const document = SwaggerModule.createDocument(
      app,
      builder.build(),
      documentOptions,
    );

    SwaggerModule.setup(config.path || 'api', app, document, customOptions);
  }
}
