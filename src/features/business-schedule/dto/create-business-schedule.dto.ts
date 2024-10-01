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
    example: [1, 7],
    description: 'Array of holiday days  [1,.., 7]',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ArrayMinSize(1) // Minimum one holiday
  @ArrayMaxSize(7) // Maximum seven holidays (if you want to limit the array size)
  @IsIn([1, 2, 3, 4, 5, 6, 7], { each: true }) // Ensure values are between 1 and 7
  holidays: number[]; // Array of holiday days (e.g., [1, 5])

  @ApiProperty({
    example: 'hh:mm:ss',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime must be in the format hh:mm:ss',
  })
  startTime: string; // Working start time (e.g., '09:00:00')

  @ApiProperty({
    example: 'hh:mm:ss',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime must be in the format hh:mm:ss',
  })
  endTime: string; // Working end time (e.g., '17:00:00')

  @ApiProperty({
    example: 30,
    description: 'timeInterval based minutes',
  })
  @IsNumber()
  @Min(20) // Ensure at least a 1-minute interval
  timeInterval: number; // Interval in minutes (e.g., 30 or 60)
}
