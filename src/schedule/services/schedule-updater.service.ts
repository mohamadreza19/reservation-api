import { Injectable } from '@nestjs/common';
import { Schedule } from '../entities/schedule.entity';
import { UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleUpdaterService {
  applyChanges(schedule: Schedule, dto: UpdateScheduleDto) {
    if (dto.workStart) schedule.workStart = dto.workStart;
    if (dto.workEnd) schedule.workEnd = dto.workEnd;
    if (typeof dto.isOpen === 'boolean') schedule.isOpen = dto.isOpen;
  }
}
