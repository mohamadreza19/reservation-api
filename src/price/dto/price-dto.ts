import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriceDto {
  // @ApiProperty({
  //   description: 'The ID of the non-system service to set the price for',
  //   example: '550e8400-e29b-41d4-a716-446655440002',
  // })
  // @IsUUID()
  // serviceId: string;

  @ApiProperty({
    description: 'The price amount',
    example: 1000000000,
  })
  @IsNumberString()
  amount: string;
}

export class UpdatePriceDto {
  @ApiPropertyOptional({
    description: 'The updated price amount',
    example: '5900000',
  })
  @IsOptional()
  @IsNumberString()
  amount?: string;
}
