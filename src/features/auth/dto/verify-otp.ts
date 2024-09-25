import { IsString, IsNotEmpty } from 'class-validator';
import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  otp: number;

  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: number;
}
