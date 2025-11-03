import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindAllBusinessServiceDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  serviceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  name: string;
}
