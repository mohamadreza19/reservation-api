import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';

export class LoginDto {
  @ApiProperty()
  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: string;
}
