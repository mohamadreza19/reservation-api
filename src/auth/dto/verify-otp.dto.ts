// src/auth/dto/verify-otp.dto.ts
import { IsEnum, IsPhoneNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+989123456789',
    description: 'Phone number in international format',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit verification code',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @ApiProperty({
    enum: Role,
    example: Role.CUSTOMER,
  })
  @IsEnum(Role)
  role: Role;
}
