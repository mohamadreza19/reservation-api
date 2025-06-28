import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import * as fs from 'fs/promises';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';

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
          name: 'Authorization',
          in: 'header',
          description:
            'Enter JWT token in the format: Bearer <token>. Use the /auth/login endpoint to generate a token.',
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

    // Write the Swagger JSON to a file
    fs.writeFile('swagger.json', JSON.stringify(document, null, 2));

    SwaggerModule.setup(config.path || 'api', app, document, customOptions);
  }
  static generateSwaggerJson(
    app: INestApplication,
    options: SwaggerUiOptions,
  ): void {
    const { title, description, version, tag, bearerAuth } = options;

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag(tag);

    if (bearerAuth) {
      config.addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
          description: 'Enter JWT token in the format: Bearer <token>',
        },
        'JWT-auth',
      );
    }

    const document = SwaggerModule.createDocument(app, config.build());

    // Save the document to swagger.json
    fs.writeFile('./swagger.json', JSON.stringify(document, null, 2));
  }
}
