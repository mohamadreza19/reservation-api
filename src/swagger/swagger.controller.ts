import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppModule } from '../app.module'; // Adjust the path to your AppModule

import { readFileSync } from 'fs';
import { join } from 'path';

@ApiTags('Swagger')
@Controller('swagger-json')
export class SwaggerController {
  @Get()
  @ApiOperation({
    operationId: 'getSwaggerJson',
    summary: 'Download the OpenAPI (Swagger) JSON specification',
    description:
      'Returns the OpenAPI specification for the Vaghtban API as a JSON file.',
  })
  @ApiResponse({
    status: 200,
    description: 'OpenAPI specification retrieved successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          description: 'The OpenAPI specification in JSON format',
        },
      },
    },
  })
  getSwaggerJson(@Res() res: Response) {
    try {
      // Define the path to swagger.json
      const swaggerFilePath = join(__dirname, '..', '..', 'swagger.json');

      const swaggerDocument = readFileSync(swaggerFilePath, 'utf8');

      // Parse the JSON to ensure it's valid
      const document = JSON.parse(swaggerDocument);

      // Set response headers for JSON download
      res.set({
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="swagger.json"',
      });

      // Send the JSON document
      res.send(document);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to read or parse the swagger.json file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
