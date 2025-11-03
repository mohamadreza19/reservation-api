import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBusinessServiceDto {
  @ApiProperty()
  @IsString()
  name: string;
}
