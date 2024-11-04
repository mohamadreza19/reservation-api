import { IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumberCustom } from '../validators/phone-number.validator';
import { LoginDto } from './login.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCustomerDto extends PartialType(LoginDto) {
  // @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  // phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
