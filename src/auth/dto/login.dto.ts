import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '+989012345678',
    description: 'User phone number in international format',
    required: true,
    type: String,
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: '1380',
    description: 'User password (min 8 characters)',
    required: true,
    type: String,
    minLength: 8,
  })
  @IsString()
  password: string;
}
