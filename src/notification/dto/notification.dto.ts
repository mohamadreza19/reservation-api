import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsUUID('all', {
    each: true,
  })
  ids: string[];
}
