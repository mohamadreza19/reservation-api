import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-jalaali';
import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';
import { TimeslotService } from 'src/time-slot/time-slot.service';
import { Repository } from 'typeorm';
import { SyncFutureTimeslotContext } from '../dto/schedule.dto';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class ScheduleTimeslotService {
  constructor(
    @Inject(forwardRef(() => TimeslotService))
    private readonly timeslotService: TimeslotService,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async syncFutureTimeslots(context: SyncFutureTimeslotContext) {
    // 1. Update statuses if schedule open/close changed

    if (context.isOpenChange) {
      const schedule = context.getSchedule();
      const updateDto = context.getUpdateDto();
      await this.updateTimeslotStatuses(schedule.id, updateDto.isOpen);
    }

    if (context.isWorkStartChange || context.isWorkEndChange) {
      const business = context.getBusiness();
      const schedule = context.getSchedule();
      const services = await this.timeslotService.findServicesBySchedule(
        schedule.id,
      );

      const dates = await this.timeslotService.findDatesBySchedule(schedule.id);

      // remove timeSlots

      await this.timeslotService.deleteTimeslotsBySchedule(schedule.id);

      for (const { date } of dates) {
        const dateMoment = moment(date, 'YYYY-MM-DD');

        // await this.timeslotService.generateTimeslotsFromSchedule({
        //   businessId: business.id,
        //   date: dateMoment,
        //   schedule: schedule,
        //   services: services,
        // });
      }
    }
  }
  private async updateTimeslotStatuses(scheduleId: string, isOpen?: boolean) {
    if (typeof isOpen !== 'boolean') return;

    const fromStatus = isOpen
      ? TimeSlotStatus.UN_AVAILABLE
      : TimeSlotStatus.IDLE;
    const toStatus = isOpen ? TimeSlotStatus.IDLE : TimeSlotStatus.UN_AVAILABLE;

    await this.timeslotService.updateStatusesByScheduleId({
      scheduleId,
      whereStatus: fromStatus,
      toStatus,
    });
  }
}
