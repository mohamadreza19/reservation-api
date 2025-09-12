// profile.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsIranPhoneNumber } from 'src/common/validators/is-iran-phone.decorator';

export class ProfileDto {
  // @ApiPropertyOptional({ description: 'Profile unique ID', format: 'uuid' })
  // @IsUUID()
  // @IsOptional()
  // id?: string;

  @ApiPropertyOptional({ description: 'Name of the profile' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the profile',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  @IsIranPhoneNumber()
  phoneNumber?: string;
}

export class UpdateProfileDto extends ProfileDto {}
export class UpdateProfileImg {
  @ApiProperty({
    description: 'Profile image file',
    type: 'string',
    format: 'binary',
  })
  img: any;
}
