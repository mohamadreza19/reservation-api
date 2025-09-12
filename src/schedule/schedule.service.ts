import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

import { BusinessService } from '../business/business.service';

import { User } from '../user/entities/user.entity';

import { Day, DayValues, persianDayOrder } from 'src/common/enums/day.enum';
import { QueryService } from 'src/common/services/query.service';
import {
  SyncFutureTimeslotContext,
  UpdateScheduleDto,
} from './dto/schedule.dto';
import { ScheduleTimeslotService } from './services/schedule-timeslot.service';
import { ScheduleUpdaterService } from './services/schedule-updater.service';
import { ScheduleValidationService } from './services/schedule-validation.service';
import { ScheduleFactoryService } from './services/schedule-factory.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScheduleService {
  queryService: QueryService<Schedule>;

  constructor(
    private readonly scheduleValidation: ScheduleValidationService,
    private readonly scheduleUpdater: ScheduleUpdaterService,
    private readonly scheduleTimeslot: ScheduleTimeslotService,
    private readonly scheduleFactory: ScheduleFactoryService,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
    private readonly businessService: BusinessService,
  ) {
    this.queryService = new QueryService(scheduleRepo);
    // this.redis = new Redis({ host: 'localhost', port: 6379 });
  }

  async initiateSchedules(user: User) {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) throw new NotFoundException('Business not found');

    const existingSchedules = await this.getByBusinessId(business.id);
    if (existingSchedules.length > 0) {
      throw new BadRequestException('schedules already exist');
    }

    const schedulesToCreate = this.scheduleFactory.createDefaultSchedules(
      business.id,
    );
    return this.scheduleRepo.save(schedulesToCreate);
  }

  async getSchedules(user: User) {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) throw new NotFoundException('Business not found');
    return this.scheduleRepo.find({
      where: {
        business: { id: business.id },
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

  async update(id: string, user: User, dto: UpdateScheduleDto) {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) throw new NotFoundException('Business not found');

    const schedule = await this.scheduleValidation.validateOwnership(
      id,
      business.id,
    );
    const context = new SyncFutureTimeslotContext();

    context
      .addSchedule(schedule)
      .addUpdateDto(dto)
      .addBusiness(business)
      .applyUpdateDtoToSchedule();

    await this.scheduleTimeslot.syncFutureTimeslots(context);

    await this.scheduleRepo.save(schedule);

    return schedule;
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
