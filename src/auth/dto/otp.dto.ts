import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsPhoneNumber, IsString, Length } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class GeneratedOtpDto {
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Timestamp when OTP will expire',
    required: false,
  })
  expires: Date;

  @ApiProperty({
    example: '123456',
    description: 'OTP code (only included in development/test environments)',
    required: false,
  })
  otp: string;
}
export class GenerateOtpResponseDto extends PartialType(GeneratedOtpDto) {
  @ApiProperty()
  isNew: boolean;
}
export class SendOtpDto {
  phoneNumber: string;
  otp: string;
}
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
