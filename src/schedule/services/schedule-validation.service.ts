import { Injectable, NotFoundException } from '@nestjs/common';
import { Schedule } from '../entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleValidationService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async validateOwnership(
    scheduleId: string,
    businessId: string,
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: scheduleId, business: { id: businessId } },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }
}
