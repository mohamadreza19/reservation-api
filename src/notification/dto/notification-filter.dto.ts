import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean';

export class NotificationFilterDto {
  @ApiProperty()
  @ToBoolean()
  @IsBoolean()
  isRead: boolean;
}
