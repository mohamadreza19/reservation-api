// src/auth/dto/otp-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OtpResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether OTP was sent successfully',
  })
  success: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Timestamp when OTP will expire',
    required: false,
  })
  expiresAt?: Date;

  @ApiProperty({
    example: '123456',
    description: 'OTP code (only included in development/test environments)',
    required: false,
  })
  otp?: string;
}
