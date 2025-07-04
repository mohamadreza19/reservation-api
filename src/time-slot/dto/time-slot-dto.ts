import { ParseBoolPipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean';
import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';

export class UpdateTimeslotDto {
  @IsOptional()
  @IsUUID()
  scheduleId?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}

export class AvailableDateRangeDto {
  // @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class TimeslotByDateDto {
  @ApiProperty({
    description: 'Unique identifier for the timeslot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Date of the timeslot in YYYY-MM-DD format',
    example: '2025-06-01',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Start time of the timeslot in HH:mm format',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the timeslot in HH:mm format',
    example: '09:30',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Indicates if the timeslot is available for booking',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;
}

export class TimeslotAvailableRangeQueryDto {
  @ApiProperty()
  @IsUUID()
  businessId: string;

  @ApiPropertyOptional()
  @IsOptional()
  scheduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  isAvailable?: boolean;
}

export class GetTimeslotsByDate {
  @ApiProperty()
  @IsUUID()
  businessId: string;

  @ApiProperty()
  @IsDateString()
  date: string;
  @ApiPropertyOptional({
    enum: TimeSlotStatus,
  })
  @IsOptional()
  status?: TimeSlotStatus;
}

export class GetStatusResDto {
  @ApiProperty()
  gapFromNow: number;
}
