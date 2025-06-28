// src/auth/dto/otp-request.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsIranPhoneNumber } from 'src/common/validators/is-iran-phone.decorator';

export class OtpRequestDto {
  @ApiProperty({
    example: '+989123456789',
    description: 'Phone number in international format',
  })
  @IsIranPhoneNumber()
  phoneNumber: string;
}
