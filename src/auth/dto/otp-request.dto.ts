// src/auth/dto/otp-request.dto.ts
import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpRequestDto {
  @ApiProperty({
    example: '+989123456789',
    description: 'Phone number in international format',
  })
  @IsPhoneNumber() // Validates phone number format
  phoneNumber: string;
}
