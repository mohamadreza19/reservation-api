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

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  timeSlotId: number;
}
