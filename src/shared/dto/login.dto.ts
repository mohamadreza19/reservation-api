import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';

export class LoginDto {
  @ApiProperty({
    example: '9012446913',
  })
  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: string;

  // @ApiProperty({
  //   example: 'test@email.com',
  // })
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;
}
