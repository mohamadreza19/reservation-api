import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import 'reflect-metadata';

export function CopyApiProperty(targetClass: any, propertyKey: string) {
  const metadata =
    Reflect.getMetadata('swagger/apiModelPropertiesArray', targetClass) || {};

  const propertyMetadata = metadata[propertyKey];

  if (propertyMetadata) {
    return applyDecorators(ApiProperty(propertyMetadata));
  }

  return applyDecorators();
}
