import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({
    description: 'The ID of the user associated with the business',
    example: 'user123',
    nullable: true,
  })
  @ApiPropertyOptional({
    description: 'The updated address of the business',
    example: '456 New St, City, Country',
  })
  address?: string;
  @ApiPropertyOptional({
    description: 'The name of business',
    example: 'Beauty Salon',
  })
  name?: string;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
