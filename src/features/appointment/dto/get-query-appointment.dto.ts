import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentFilter } from 'src/shared/types/appointment-filter.eum';

export class GetQueryAppointmentsDto {
  @ApiProperty({
    required: false,
  })
  search: string;

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

  @ApiProperty({
    type: 'eum',

    enum: AppointmentFilter,
    required: true,
  })
  @IsEnum(AppointmentFilter)
  status: AppointmentFilter;
}
