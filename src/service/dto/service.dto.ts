import {
  ApiParam,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsUUID,
  ValidateNested,
  isUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Price } from 'src/price/entities/price.entity';
import { User } from 'src/user/entities/user.entity';
import { ToBoolean } from 'src/common/decorators/to-boolean';
import { CreatePriceDto } from 'src/price/dto/price-dto';

export class CreateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'آرایش دائم',
    type: String,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'A description of the service (optional)',
    example: 'Permanent makeup service',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description:
      'The ID of the business the service belongs to (optional for system services)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    type: String,
  })
  @IsUUID()
  @IsOptional()
  businessId?: string;

  @ApiPropertyOptional({
    description:
      'The ID of the parent service for hierarchical services (optional)',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Whether the service is a system service (defaults to false)',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isSystemService?: boolean = false;

  @ApiPropertyOptional({
    type: CreatePriceDto,
  })
  @IsOptional()
  price: CreatePriceDto;

  @IsOptional()
  icon: string;
}
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
export class FindServicesDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Filter by system services (true) or non-system services (false)',
    example: true,
  })
  @IsOptional()
  @ToBoolean()
  isSystemService?: boolean;
}

export class ServiceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isSystemService: boolean;

  @ApiPropertyOptional({ type: () => Price })
  price: Price;

  @ApiPropertyOptional({ type: () => [ServiceDto] })
  @Type(() => ServiceDto)
  children?: ServiceDto[];
}
export class PaginatedServiceDto {
  @ApiProperty({ type: [ServiceDto] })
  data: ServiceDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class UpdateServiceArgsDto {
  @ApiProperty({ description: 'ID of the service to update' })
  @IsString()
  id: string;

  @ApiProperty({
    type: UpdateServiceDto,
    description: 'Service data to update',
  })
  @ValidateNested()
  @Type(() => UpdateServiceDto)
  data: UpdateServiceDto;

  @ApiProperty({ description: 'User performing the update' })
  @ValidateNested()
  @Type(() => User)
  user: User;

  @ApiProperty({ description: 'Uploaded icon file', required: false })
  file?: Express.Multer.File;
}

export class FindServiceByBusiness {
  @ApiPropertyOptional({
    description: 'ID of the parent service',
    example: 'uuid',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Flag to filter system services',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @ToBoolean()
  isSystemService?: boolean;
}
