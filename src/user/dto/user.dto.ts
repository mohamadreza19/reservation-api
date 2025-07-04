// create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+989123456789',
  })
  @IsPhoneNumber('IR') // adjust for your region
  phoneNumber: string;

  @ApiProperty({
    description: 'Password for the user (if applicable)',
    example: 'StrongP@ssw0rd!',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: Role,
    default: Role.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'userName',
    example: 'userName',
    required: false,
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Ali',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Rezaei',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
