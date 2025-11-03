import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBusinessServiceDto {
  @ApiProperty()
  @IsUUID()
  serviceId: string;
  @ApiProperty()
  @IsString()
  name: string;
}
