import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetTimeSlotDto {
  @ApiProperty()
  search: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'The start date of the week (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'weekStartDate must be a valid date (YYYY-MM-DD)' },
  )
  weekStartDate: string;

  @ApiProperty({
    type: String,
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    type: String,
    format: 'date',

    required: false,
  })
  @IsOptional()
  @IsDateString({})
  endDate: string;
}
