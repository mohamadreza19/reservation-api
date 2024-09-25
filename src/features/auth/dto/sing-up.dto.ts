import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';

export class SignUp {
  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: string;
}
