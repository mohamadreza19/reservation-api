import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsIranPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isIranPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' && /^\+98\d{10}$/.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Phone number must start with +98 and be followed by exactly 10 digits';
        },
      },
    });
  };
}
