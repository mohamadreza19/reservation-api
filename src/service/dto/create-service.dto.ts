import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  businessId?: string; // Optional for child services

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  isSystemService?: boolean = false; // Default to false
}
