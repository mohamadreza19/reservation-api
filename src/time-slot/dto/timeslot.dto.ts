import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { Business } from 'src/business/entities/business.entity';
import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';

export class GenerateTimeslotsFromScheduleDto {
  businessId: string;
  schedule: Schedule;
  date: moment.Moment;
  services: Service[];
}
export class GenerateTimeslotsFromScheduleDto2 {
  businessId: string;
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

export class UpdateStatusesByScheduleDto {
  scheduleId: string;
  whereStatus: TimeSlotStatus;
  toStatus: TimeSlotStatus;
}
