import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  Matches,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Day } from 'src/common/enums/day.enum';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Day of the week or holiday',
    enum: Day,
    example: Day.MONDAY,
  })
  @IsEnum(Day)
  day: Day;

  @ApiProperty({
    description: 'Start time in HH:mm:ss format (e.g., 09:00:00)',
    example: '09:00:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({
    description: 'End time in HH:mm:ss format (e.g., 17:00:00)',
    example: '17:00:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({
    description: 'Whether the day is closed',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}

export class UpdateIntervalForAllDto {
  @ApiProperty({
    example: '00:30:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'time must be in the format hh:mm:ss (e.g., 00:30:00)',
  })
  time: string;
}
