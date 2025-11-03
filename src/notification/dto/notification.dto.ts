import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationEvent } from 'src/common/enums/notification-event.enum';

export class NotificationDto {
  @ApiProperty({
    description: 'Unique identifier of the notification',
    example: 'e2f3a5b0-61a3-4a19-9b47-bf4f7f52d24c',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User ID the notification belongs to',
    example: 'c3f0d1d2-7343-49a0-8a45-88a5bb9323ff',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Additional payload or metadata for the notification',
    example: '{"appointmentId": "a1b2c3d4"}',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  payload?: string;

  @ApiProperty({
    description: 'Type of notification event',
    enum: NotificationEvent,
    example: NotificationEvent.APPOINTMENT_PUSH,
  })
  @IsEnum(NotificationEvent)
  type: NotificationEvent;

  @ApiProperty({
    description: 'Indicates whether the notification has been read',
    example: false,
    default: false,
  })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    description: 'Date when the notification was created',
    example: '2025-10-31T12:45:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the notification was last updated',
    example: '2025-10-31T13:00:00.000Z',
  })
  updatedAt: Date;
}
