// common/dto/query.dto.ts

import {
  IsOptional,
  IsInt,
  IsString,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];
}

export class GetEntityByDateByDate {
  @ApiProperty()
  @IsDateString()
  date: string;
}
