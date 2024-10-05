import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateBusinessScheduleDto {
  @ApiProperty({
    example: [0, 6],
    description: 'Array of holiday days  [0,.., 6]',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ArrayMinSize(1) // Minimum one holiday
  @ArrayMaxSize(7) // Maximum seven holidays (if you want to limit the array size)
  @IsIn([0, 1, 2, 3, 4, 5, 6], { each: true }) // Ensure values are between 1 and 7
  holidays: number[]; // Array of holiday days (e.g., [0, 6])

  @ApiProperty({
    example: 'hh:mm:ss',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startHour must be in the format hh:mm',
  })
  startHour: string; // Working start time (e.g., '09:00')

  @ApiProperty({
    example: 'hh:mm',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endHour must be in the format hh:mm',
  })
  endHour: string; // Working end time (e.g., '17:00')

  @ApiProperty({
    example: 30,
    description: 'timeInterval based minutes',
  })
  @IsNumber()
  @Min(20) // Ensure at least a 1-minute interval
  timeInterval: number; // Interval in minutes (e.g., 30 or 60)
}
