import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { Day, DayValues } from 'src/common/enums/day.enum';

@Injectable()
export class ScheduleFactoryService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  createDefaultSchedules(businessId: string): Schedule[] {
    const allDays: Day[] = DayValues();
    return allDays.map((dayValue) => {
      const isFriday = dayValue === Day.FRIDAY;
      return this.scheduleRepo.create({
        day: dayValue,
        workStart: '09:00',
        workEnd: '17:00',
        isOpen: !isFriday,
        business: { id: businessId },
      });
    });
  }
}
