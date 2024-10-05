import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';
import { LoginDto } from './login.dto';

export class VerifyOtpDto extends PartialType(LoginDto) {
  @ApiProperty({
    example: '9012446913',
  })
  @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  phoneNumber: string;

  @ApiProperty({
    example: '11111',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
