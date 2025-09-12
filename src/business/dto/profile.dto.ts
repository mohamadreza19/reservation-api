import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({
    example: 37.7749,
    description: 'Latitude of the business location',
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    example: -122.4194,
    description: 'Longitude of the business location',
  })
  @IsNumber()
  lng: number;
}

export class CreateBusinessProfileDto {
  @ApiPropertyOptional({
    type: LocationDto,
    description: 'Geographic coordinates of the business',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({
    example: 'My Shop',
    description: 'Business display name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '123 Main St, San Francisco, CA',
    description: 'Business address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  // @ApiPropertyOptional({ description: 'Associated business ID (UUID)' })
  // // @IsOptional()
  // @IsUUID()
  // businessId: string;
}
export class UpdateBusinessProfileDto extends PartialType(
  CreateBusinessProfileDto,
) {}
