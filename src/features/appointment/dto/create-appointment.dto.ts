import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  serviceProfileId: number;

  @ApiProperty({
    example: 'YYYY-MM-DD',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'HH:mm',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startHour must be in the format hh:mm',
  })
  hour: string;
}
