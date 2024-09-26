import { IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumberCustom } from '../validators/phone-number.validator';

export class CreateCustomerDto {
  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
