import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  // @ApiPropertyOptional({
  //   description: 'Sort field and direction (e.g., "name:ASC,createdAt:DESC")',
  //   example: 'name:ASC',
  // })
  // @IsOptional()
  // @IsString()
  // sort?: string;

  // @ApiPropertyOptional({
  //   description: 'Filter by business ID',
  //   example: 'uuid-of-business',
  // })
  // @IsOptional()
  // @IsUUID()
  // businessId?: string;

  // @ApiPropertyOptional({
  //   description: 'Filter by parent service ID',
  //   example: 'uuid-of-parent-service',
  // })
  // @IsOptional()
  // @IsUUID()
  // parentId?: string;

  @ApiPropertyOptional({
    description:
      'Filter by system services (true) or non-system services (false)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSystemService?: boolean;

  // @ApiPropertyOptional({
  //   description: 'Filter to include only root services (no parent)',
  //   example: true,
  // })
  // @IsOptional()
  // @Type(() => Boolean)
  // @IsBoolean()
  // rootOnly?: boolean;
}
