import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsPhoneNumberCustomConstraint } from '../decorators/phone-number.decorator';

export function IsPhoneNumberCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberCustomConstraint,
    });
  };
}
