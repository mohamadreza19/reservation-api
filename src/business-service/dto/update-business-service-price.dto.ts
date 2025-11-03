import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class UpdateBusinessServicePriceDto {
  @ApiProperty()
  @IsNumber()
  price: number;
}
