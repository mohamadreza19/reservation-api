// src/auth/dto/verify-otp-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class VerifyOtpResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token if verification succeeds',
    required: false,
  })
  access_token?: string;

  @ApiProperty()
  isNew: boolean;
  @ApiProperty({
    type: 'string',
    enum: Role,
  })
  role: Role;
}
