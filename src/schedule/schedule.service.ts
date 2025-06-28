import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, FindOptionsWhere } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

import { BusinessService } from '../business/business.service';
import { Redis } from 'ioredis';

import { User } from '../user/entities/user.entity';

import { Day, DayValues, persianDayOrder } from 'src/common/enums/day.enum';
import { QueryService } from 'src/common/services/query.service';
import { UpdateIntervalForAllDto, UpdateScheduleDto } from './dto/schedule.dto';
import * as moment from 'moment-jalaali';
import { TimeslotService } from 'src/time-slot/time-slot.service';

@Injectable()
export class ScheduleService {
  queryService: QueryService<Schedule>;
  private readonly redis: Redis;
  private readonly DEFAULT_DURATION = 30; // Default duration in minutes

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,

    private readonly businessService: BusinessService,
    @Inject(forwardRef(() => TimeslotService))
    private readonly timeslotService: TimeslotService,
  ) {
    this.queryService = new QueryService(scheduleRepo);
    // this.redis = new Redis({ host: 'localhost', port: 6379 });
  }

  async initiateSchedules(user: User) {
    const business = await this.businessService.findByUserId(user.id);
    const existingSchedules = await this.getByBusinessId(business.id);
    if (existingSchedules.length > 0) {
      throw new BadRequestException('schedules already exist');
    }
    const allDays: Day[] = DayValues();

    // Create all schedule instances first
    // Create all schedule instances first
    const schedulesToCreate = allDays.map((dayValue) => {
      const isFriday = dayValue === Day.FRIDAY;
      return this.scheduleRepo.create({
        day: dayValue,
        startTime: isFriday ? null : '09:00',
        endTime: isFriday ? null : '17:00',
        interval: '00:35',
        isOpen: !isFriday,
        business: { id: business.id },
      });
    });

    // Save all schedules in bulk
    const savedSchedules = await this.scheduleRepo.save(schedulesToCreate);

    return savedSchedules;
  }

  async generateTimeslots() {}

  async getSchedules(user: User) {
    const business = await this.businessService.findByUserId(user.id);

    return this.scheduleRepo.find({
      where: {
        business,
      },
      select: {
        business: false,
      },
      order: {
        day: 'ASC',
      },
    });
  }
  async getByBusinessId(businessId: string) {
    return this.scheduleRepo.find({
      where: {
        business: {
          id: businessId,
        },
      },
      order: {
        day: 'ASC', // sort by day in ascending order (1-7)
      },
    });
  }

  async update(id: string, user: User, updateScheduleDto: UpdateScheduleDto) {
    const business = await this.businessService.findByUserId(user.id);

    let schedule = await this.scheduleRepo.findOne({
      where: {
        id,
        business,
      },
    });
    if (!schedule) throw NotFoundException;

    if (updateScheduleDto.startTime) {
      schedule.startTime = updateScheduleDto.startTime;
    }
    if (updateScheduleDto.endTime) {
      schedule.startTime = updateScheduleDto.endTime;
    }
    if (typeof updateScheduleDto.isOpen == 'boolean') {
      schedule.isOpen = updateScheduleDto.isOpen;
    }

    await this.scheduleRepo.save(schedule);

    const availableDates = await this.timeslotService.getAvailableDateRange({
      businessId: business.id,
      // isAvailable: true,
      scheduleId: schedule.id,
    });
    const scheduleDayMap = await this.getDayMapScheduleByPersianDayOrder(
      business.id,
    );

    for (const availableDate of availableDates) {
      const timeslotsByDate = await this.timeslotService.findAll({
        where: {
          business,
          date: availableDate.date,
        },
      });

      this.timeslotService.removeAll(timeslotsByDate);

      const dayOfWeek = moment(availableDate.date, 'YYYY-MM-DD').format('dddd');

      const schedule = scheduleDayMap.get(dayOfWeek.toLocaleLowerCase());

      if (schedule) {
        this.timeslotService.generateTimeslotsFromSchedule(
          business,
          schedule,
          moment(availableDate.date, 'YYYY-MM-DD'),
        );
      }
    }
    return;
  }
  async updateSchedulesInterval(data: UpdateIntervalForAllDto, user: User) {
    const business = await this.businessService.findByUserId(user.id);

    // this.timeslotService.generateTimeslotsFromSchedule()
    // console.log(object);

    const time = moment(data.time, 'HH:mm:ss', true);

    if (!time.isValid()) {
      throw new BadRequestException('Invalid time format. Expected HH:mm:ss');
    }

    await this.scheduleRepo.update(
      {
        business,
      },
      {
        interval: data.time,
      },
    );

    const scheduleDayMap = await this.getDayMapScheduleByPersianDayOrder(
      business.id,
    );
    const availableDates = await this.timeslotService.getAvailableDateRange({
      businessId: business.id,
    });

    for (const availableDate of availableDates) {
      const timeslotsByDate = await this.timeslotService.findAll({
        where: {
          business,
          date: availableDate.date,
        },
      });

      this.timeslotService.removeAll(timeslotsByDate);

      const dayOfWeek = moment(availableDate.date, 'YYYY-MM-DD').format('dddd');
      const schedule = scheduleDayMap.get(dayOfWeek.toLocaleLowerCase());

      if (schedule) {
        this.timeslotService.generateTimeslotsFromSchedule(
          business,
          schedule,
          moment(availableDate.date, 'YYYY-MM-DD'),
        );
      }
    }
  }

  async getDayMapScheduleByPersianDayOrder(
    businessId: string,
  ): Promise<Map<string, Schedule>> {
    const schedules = await this.getByBusinessId(businessId);

    const dayMap = new Map<string, Schedule>(
      schedules.map((s) => [persianDayOrder[s.day], s]),
    );
    // dayMap.get('saturday') // schedule
    return dayMap;
  }
}
