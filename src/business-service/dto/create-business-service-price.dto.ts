import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateBusinessServicePriceDto {
  @ApiProperty()
  @IsUUID()
  businessServiceId: string;
  @ApiProperty()
  @IsNumber()
  price: number;
}
