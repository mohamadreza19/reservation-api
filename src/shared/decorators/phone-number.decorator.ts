import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPhoneNumberCustom', async: false })
export class IsPhoneNumberCustomConstraint
  implements ValidatorConstraintInterface
{
  validate(phoneNumber: string, args: ValidationArguments) {
    // Custom regex to accept exactly 10 digits (e.g., 9032446913)

    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber); // Returns true if the number is valid
  }

  defaultMessage(args: ValidationArguments) {
    // Custom error message
    return 'Phone number must be exactly 10 digits long.';
  }
}
