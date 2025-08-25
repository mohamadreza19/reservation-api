import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { Business } from 'src/business/entities/business.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';

export class GenerateTimeslotsFromScheduleDto {
  business: Business;
  schedule: Schedule;
  date: moment.Moment;
  services: Service[];
}

export class UpdateServicesTimeSlots {
  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[];
}
