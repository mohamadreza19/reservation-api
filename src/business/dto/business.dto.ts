import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';

export class CreateBusinessDto {
  @ApiProperty()
  @IsOptional()
  address: string;
  @ApiProperty()
  @IsOptional()
  name: string;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}

export class PublicBusinessDto {
  @ApiProperty({
    description: 'The unique identifier of the business',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The name of the business',
    example: 'Example Coffee Shop',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The address of the business',
    example: '123 Main Street, City, Country',
    type: String,
  })
  address: string;
}

class LocationDto {
  @ApiProperty({
    example: 37.7749,
    description: 'Latitude of the business location',
  })
  @Expose()
  lat: number;

  @ApiProperty({
    example: -122.4194,
    description: 'Longitude of the business location',
  })
  @Expose()
  lng: number;
}

export class ShowBProfileDto {
  @ApiProperty({
    example: 'b3f81a3a-62cf-4d84-91e3-9efc0b58f612',
    description: 'Unique identifier of the business profile',
  })
  @Expose()
  id: string;

  @ApiPropertyOptional({
    type: LocationDto,
    description: 'Geographical location of the business',
  })
  @Expose()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({
    example: 'Acme Coffee Shop',
    description: 'Name of the business',
  })
  @Expose()
  name?: string;

  @ApiPropertyOptional({
    example: '123 Main St, Springfield',
    description: 'Business address',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    example: 'c6e2a2e3-9b57-4a0b-8f51-9a2e9dfe2a61',
    description: 'Associated business ID',
  })
  @Expose()
  businessId?: string;
}

export class BusinessProfileDto {
  @ApiProperty({ example: 'uuid-value' })
  id: string;

  @ApiProperty({ example: 'Acme Corp', required: false, nullable: true })
  name: string;

  @ApiProperty({ example: '123 Main St', required: false, nullable: true })
  address: string;

  @ApiProperty({ type: () => CreateUserDto })
  userInfo: CreateUserDto;
  @ApiProperty({ type: () => ShowBProfileDto })
  bProfile: ShowBProfileDto;
}

export class BusinessLinkDto {
  @ApiProperty()
  url: string;
}

export class UpdateBusinessProfileDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  location?: { lat: number; lng: number };
}
