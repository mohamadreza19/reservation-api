import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DeleteBusinessServiceDto {
  @ApiProperty()
  @IsUUID()
  businessServiceId: string;
}
