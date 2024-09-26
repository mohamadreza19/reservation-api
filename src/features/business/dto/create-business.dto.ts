import { IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';

export class CreateBusinessDto {
  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
