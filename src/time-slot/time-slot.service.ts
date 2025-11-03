import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-jalaali';
import { persianDayOrder } from 'src/common/enums/day.enum';
import { FindManyOptions, Repository } from 'typeorm';
import { Service } from '../service/entities/service.entity';
moment.loadPersian();

import { BusinessService } from '../business/business.service';
import { ScheduleService } from '../schedule/schedule.service';
import { User } from '../user/entities/user.entity';

import { Schedule } from '../schedule/entities/schedule.entity';

import { Timeslot } from './entities/time-slot.entity';

import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';
import { QueryService } from 'src/common/services/query.service';
import { ServiceService } from 'src/service/service.service';
import {
  AvailableDateRangeDto,
  GetStatusResDto,
  GetTimeslotsByDate,
  TimeslotAvailableRangeQueryDto,
  UpdateTimeslotDto,
} from './dto/time-slot-dto';
import {
  GenerateTimeslotsFromScheduleDto,
  UpdateServicesTimeSlots,
  UpdateStatusesByScheduleDto,
} from './dto/timeslot.dto';
import {
  futureTimeslotCondition,
  noEmployeeCondition,
  statusInCondition,
} from './utils/timeslot.util';

@Injectable()
export class TimeslotService {
  queryService: QueryService<Timeslot>;
  constructor(
    private readonly businessService: BusinessService,
    private readonly scheduleService: ScheduleService,
    @InjectRepository(Timeslot)
    private readonly timeslotRepo: Repository<Timeslot>,
    private readonly service: ServiceService,
  ) {
    this.queryService = new QueryService(this.timeslotRepo);
  }

  async generateTimeslots(
    user: User,
    // serviceId: string,
  ): Promise<string> {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) {
      throw new ForbiddenException('No business associated with this user');
    }
    const schedules = await this.scheduleService.getByBusinessId(business.id);
    if (schedules.length !== 7) {
      throw new BadRequestException(
        'Business must have schedules for all 7 days',
      );
    }
    const services = await this.service.findByBusinessId(business.id);
    const today = moment(); // Get current date dynamically (e.g., 2025-05-25 23:49 CEST)

    // Create Map with lowercase day names as keys
    const dayMap = new Map<string, Schedule>(
      schedules.map((s) => [persianDayOrder[s.day], s]),
    );
    const DayToGenerate = 12;
    for (let i = 1; i <= DayToGenerate; i++) {
      const date = today.clone().add(i, 'days');

      const dayOfWeek = date.format('dddd').toLocaleLowerCase(); // e.g., 'saturday'

      // console.log([persianDayOrder[s.day]);
      const schedule = dayMap.get(dayOfWeek);
      if (!schedule) {
        continue; // Should not happen due to 7-day validation
      }
      await this.generateTimeslotsFromSchedule({
        businessId: business.id,
        schedule,
        date,
        services,
      });
    }

    return 'time slots created successfully';
  }
  /** 3. Generate new timeslots from schedule and service for a specific date */
  async generateTimeslotsFromSchedule({
    businessId,
    schedule,
    services,
    date,
  }: GenerateTimeslotsFromScheduleDto) {
    // let intervalMinutes = this.convertTimeToMinutes(schedule.interval);
    // const services = await this.service.findByBusinessId(business.id);
    let timeslots: Timeslot[] = [];
    let start: moment.Moment;
    let end: moment.Moment;

    for (const service of services) {
      start = moment(
        `${date.format('YYYY-MM-DD')} ${schedule.workStart}`,
        'YYYY-MM-DD HH:mm:ss',
      );
      end = moment(
        `${date.format('YYYY-MM-DD')} ${schedule.workEnd}`,
        'YYYY-MM-DD HH:mm:ss',
      );

      while (start < end) {
        // console.log('index', i);

        const slotEnd = start.clone().add(service.durationInMinutes, 'minutes');
        if (slotEnd > end) break;

        const instance = this.timeslotRepo.create({
          schedule: {
            id: schedule.id,
          },
          service: {
            id: service.id,
          },
          business: {
            id: businessId,
          },
          date: date.format('YYYY-MM-DD'), // e.g., '2025-05-24'
          tStart: start.format('HH:mm'), // e.g., '09:00'
          tEnd: slotEnd.format('HH:mm'), // e.g., '09:30'
          status: schedule.isOpen
            ? TimeSlotStatus.IDLE
            : TimeSlotStatus.UN_AVAILABLE,
        });

        timeslots.push(instance);

        start.add(service.durationInMinutes, 'minutes');
      }
    }

    return this.timeslotRepo.save(timeslots);
  }

  async findServicesBySchedule(scheduleId: string) {
    const results = await this.timeslotRepo
      .createQueryBuilder('timeslot')
      .leftJoin('timeslot.service', 'service')
      .where('timeslot.scheduleId = :scheduleId', { scheduleId })
      .andWhere(futureTimeslotCondition())
      .andWhere(noEmployeeCondition())
      .andWhere(
        statusInCondition([TimeSlotStatus.IDLE, TimeSlotStatus.UN_AVAILABLE]),
      )
      .select('DISTINCT service.id', 'serviceId')
      .getRawMany();

    const ids = results.map((r) => r.serviceId);
    const services = await this.service.findAllByIds(ids);

    return services;
  }

  async findSchedulesByService(serviceId: string): Promise<Schedule[]> {
    const timeslots = await this.timeslotRepo
      .createQueryBuilder('timeslot')
      .leftJoinAndSelect('timeslot.schedule', 'schedule')
      .where('timeslot.service = :serviceId', { serviceId }) // note: use the relation name
      .getMany();

    // Extract unique schedules from timeslots
    const schedulesMap = new Map<string, Schedule>();
    timeslots.forEach((ts) => {
      if (ts.schedule) {
        schedulesMap.set(ts.schedule.id, ts.schedule);
      }
    });

    return Array.from(schedulesMap.values());
  }

  async findDatesBySchedule(
    scheduleId: string,
    serviceIds?: string[],
  ): Promise<{ date: string }[]> {
    const query = this.timeslotRepo
      .createQueryBuilder('timeslot')
      .where('timeslot.scheduleId = :scheduleId', { scheduleId })
      .andWhere(futureTimeslotCondition())
      .andWhere(noEmployeeCondition())
      .andWhere(
        statusInCondition([TimeSlotStatus.IDLE, TimeSlotStatus.UN_AVAILABLE]),
      );

    if (serviceIds && serviceIds.length > 0) {
      query.andWhere('timeslot.serviceId IN (:...serviceIds)', { serviceIds });
    }

    return query
      .select('DISTINCT timeslot.date', 'date')
      .orderBy('timeslot.date', 'ASC')
      .getRawMany();
  }

  private convertTimeToMinutes(time: string): number {
    // Expect time in format 'HH:mm:ss' (e.g., '00:30:00')
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  async findOneById(id: string) {
    return this.timeslotRepo.findOne({
      where: { id },
    });
  }
  async update(timeslot: Timeslot) {
    return this.timeslotRepo.save(timeslot);
  }
  async findAll(options?: FindManyOptions<Timeslot> | undefined) {
    return this.timeslotRepo.find(options);
  }

  async removeAll(entities: Timeslot[]) {
    return this.timeslotRepo.remove(entities);
  }
  async updateById(id: string, updateDto: UpdateTimeslotDto) {
    const existing = await this.timeslotRepo.findOne({
      where: { id },
      relations: [],
    });

    if (!existing) {
      throw new NotFoundException(`Timeslot with ID ${id} not found`);
    }

    // Update the fields from the DTO
    if (updateDto.date !== undefined) existing.date = updateDto.date;
    if (updateDto.startTime !== undefined)
      if (updateDto.isAvailable !== undefined)
        // existing.startTime = updateDto.startTime;
        // if (updateDto.endTime !== undefined) existing.endTime = updateDto.endTime;
        // existing.isAvailable = updateDto.isAvailable;

        // Save the updated entity
        return this.timeslotRepo.save(existing);
  }

  async getAvailableDateRange(
    query: TimeslotAvailableRangeQueryDto,
  ): Promise<AvailableDateRangeDto[]> {
    const business = await this.businessService.findOneById(query.businessId);
    const now = moment().format('YYYY-MM-DD');

    const isAvailable = query.isAvailable || true;

    if (!business) throw new BadRequestException('Business not found');

    const queryBuild = this.timeslotRepo
      .createQueryBuilder('timeslot')
      .select('DISTINCT timeslot.date', 'date')
      .where('timeslot.businessId = :businessId', { businessId: business.id })
      .where('timeslot.status = :status', {
        status: TimeSlotStatus.IDLE,
      })
      .andWhere('timeslot.date > :now', { now })
      .orderBy('timeslot.date', 'ASC');

    if (query.scheduleId) {
      console.log(query.scheduleId);
      queryBuild
        .innerJoin('timeslot.schedule', 'schedule')
        .andWhere('schedule.id = :scheduleId', {
          scheduleId: query.scheduleId,
        });
    }

    return queryBuild.getRawMany();
  }
  async getBookedDateRange(query: TimeslotAvailableRangeQueryDto) {
    const business = await this.businessService.findOneById(query.businessId);
    const now = moment().format('YYYY-MM-DD');
    if (!business) throw new BadRequestException('Business not found');

    const dates = await this.timeslotRepo
      .createQueryBuilder('timeslot')
      .select('DISTINCT timeslot.date', 'date')
      .where('timeslot.businessId = :businessId', { businessId: business.id })
      .where('timeslot.isAvailable = true')
      .andWhere('timeslot.date > :now', { now })
      .orderBy('timeslot.date', 'ASC')
      .getRawMany();
    return dates;
  }

  async getTimeslotsByDate(query: GetTimeslotsByDate) {
    const queryDate = moment(query.date, 'YYYY-MM-DD', true);
    if (!queryDate.isValid()) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }
    const now = moment().format('YYYY-MM-DD');

    if (queryDate.isBefore(now)) {
      throw new BadRequestException(`${query.date} is before ${now}`);
    }

    const business = await this.businessService.findOneById(query.businessId);
    if (!business) throw new BadRequestException('Business not found');

    return this.timeslotRepo.find({
      where: {
        business: {
          id: business.id,
        },
        date: queryDate.format('YYYY-MM-DD'),
        // isAvailable: true,
        status: query.status || TimeSlotStatus.IDLE,
      },
      select: {
        id: true,
        // date: true,
        tStart: true,
        tEnd: true,
        // startTime: true,
        // endTime: true,
      },
      order: {
        tStart: 'ASC',
        tEnd: 'ASC',
      },
    });
  }

  async getStatus(user: User): Promise<GetStatusResDto> {
    const now = moment().format('YYYY-MM-DD');
    const business = await this.businessService.findByUserId(user.id);
    if (!business) throw new NotFoundException('Business not found');
    const latestTimeSlot = await this.timeslotRepo.findOne({
      where: {
        business: {
          id: business.id,
        },
        // endTime: MoreThan(now),
      },
      order: {
        date: 'DESC',
      },
    });

    if (!latestTimeSlot)
      return {
        gapFromNow: -1,
      };

    const latestDate = moment(latestTimeSlot.date);
    const gap = latestDate.diff(now, 'days');

    return {
      gapFromNow: gap,
    };
  }
  async updateByServices(
    updateServicesTimeSlots: UpdateServicesTimeSlots,
    user: User,
  ) {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) {
      throw new ForbiddenException('No business associated with this user');
    }
    // const services = await this.service.findByBusinessId(
    //   business.id,
    //   updateServicesTimeSlots.serviceIds,
    // );

    const now = moment();
    const today = now.format('YYYY-MM-DD'); // only date part
    const currentTime = now.format('HH:mm'); // only time part

    await this.timeslotRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.service', 's')
      .leftJoinAndSelect('t.business', 'b')
      .where('b.id = :id', { id: business.id })
      .andWhere('t.date >= :today', { today })

      .andWhere('t.status IN (:...statuses)', {
        statuses: [TimeSlotStatus.IDLE, TimeSlotStatus.UN_AVAILABLE],
      })
      .andWhere('t.startTime >= :currentTime', { currentTime })
      .andWhere('t.endTime >= :currentTime', { currentTime }) // end after now
      .andWhere('s.id IN (:...ids)', {
        ids: updateServicesTimeSlots.serviceIds,
      })
      .delete();
  }
  async updateStatusesByScheduleId({
    scheduleId,
    whereStatus,
    toStatus,
  }: UpdateStatusesByScheduleDto) {
    return this.timeslotRepo.update(
      {
        schedule: {
          id: scheduleId,
        },
        status: whereStatus,
      },
      {
        status: toStatus,
      },
    );
  }
  /** Delete timeslots by array of IDs */
  async deleteByIds(ids: string[]) {
    if (!ids.length) return;
    await this.timeslotRepo
      .createQueryBuilder()
      .delete()
      .whereInIds(ids)
      .execute();
  }
  /** 2. Delete timeslots by schedule ID with status idle/unavailable */
  async deleteTimeslotsBySchedule(
    scheduleId: string,
    serviceIds?: string[],
  ): Promise<void> {
    const query = this.timeslotRepo
      .createQueryBuilder()
      .delete()
      .from(Timeslot)
      .where('scheduleId = :scheduleId', { scheduleId })
      .andWhere(futureTimeslotCondition())
      .andWhere(noEmployeeCondition())
      .andWhere(
        statusInCondition([TimeSlotStatus.IDLE, TimeSlotStatus.UN_AVAILABLE]),
      );

    if (serviceIds && serviceIds.length > 0) {
      query.andWhere('serviceId IN (:...serviceIds)', { serviceIds });
    }

    await query.execute();
  }

  async findBySchedule(scheduleId: string) {
    return this.timeslotRepo
      .createQueryBuilder('t')
      .select(['t.id', 't.date', 't.serviceId'])
      .where('t.scheduleId = :scheduleId', { scheduleId })
      .andWhere('t.status IN (:...statuses)', {
        statuses: [TimeSlotStatus.IDLE, TimeSlotStatus.UN_AVAILABLE],
      })
      .getRawMany<{ id: string; date: string; serviceId: string }>();
  }
}
