import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsFileConstraint } from '../decorators/file-validation.decorator';

export function IsFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFileConstraint,
    });
  };
}
