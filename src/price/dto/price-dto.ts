import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriceDto {
  @ApiProperty({
    description: 'The ID of the non-system service to set the price for',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'The price amount',
    example: 49.99,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class UpdatePriceDto {
  @ApiPropertyOptional({
    description: 'The updated price amount',
    example: 59.99,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;
}
