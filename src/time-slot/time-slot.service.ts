import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  MoreThan,
  Repository,
} from 'typeorm';
import { Service } from '../service/entities/service.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Day, persianDayOrder } from 'src/common/enums/day.enum';
import * as moment from 'moment-jalaali';
moment.loadPersian();

import { User } from '../user/entities/user.entity';
import { BusinessService } from '../business/business.service';
import { ScheduleService } from '../schedule/schedule.service';

import { Schedule } from '../schedule/entities/schedule.entity';

import { Timeslot } from './entities/time-slot.entity';

import {
  AvailableDateRangeDto,
  GetStatusResDto,
  GetTimeslotsByDate,
  TimeslotAvailableRangeQueryDto,
  UpdateTimeslotDto,
} from './dto/time-slot-dto';
import { QueryService } from 'src/common/services/query.service';
import { Business } from 'src/business/entities/business.entity';
import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';

@Injectable()
export class TimeslotService {
  private readonly DEFAULT_INTERVAL_MINUTES = 30; // Default if interval is null

  queryService: QueryService<Timeslot>;
  constructor(
    private readonly businessService: BusinessService,
    private readonly scheduleService: ScheduleService,
    @InjectRepository(Timeslot)
    private readonly timeslotRepo: Repository<Timeslot>,
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

    // const service = await this.serviceRepo.findOne({
    //   where: { id: serviceId },
    // });
    // if (!service) {
    //   throw new NotFoundException(`Service with ID ${serviceId} not found`);
    // }

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
      await this.generateTimeslotsFromSchedule(business, schedule, date);
    }

    return 'time slots created successfully';
  }
  async generateTimeslotsFromSchedule(
    business: Business,
    schedule: Schedule,
    date: moment.Moment,
  ) {
    let intervalMinutes = this.convertTimeToMinutes(schedule.interval);
    let timeslots: Timeslot[] = [];
    let start: moment.Moment;
    let end: moment.Moment;

    start = moment(
      `${date.format('YYYY-MM-DD')} ${schedule.startTime}`,
      'YYYY-MM-DD HH:mm:ss',
    );
    end = moment(
      `${date.format('YYYY-MM-DD')} ${schedule.endTime}`,
      'YYYY-MM-DD HH:mm:ss',
    );

    while (start < end) {
      // console.log('index', i);

      const slotEnd = start.clone().add(intervalMinutes, 'minutes');
      if (slotEnd > end) break;

      const instance = this.timeslotRepo.create({
        schedule: schedule,
        date: date.format('YYYY-MM-DD'), // e.g., '2025-05-24'
        startTime: start.format('HH:mm'), // e.g., '09:00'
        endTime: slotEnd.format('HH:mm'), // e.g., '09:30'
        // isAvailable: schedule.isOpen,
        status: schedule.isOpen
          ? TimeSlotStatus.IDLE
          : TimeSlotStatus.UN_AVAILABLE,
        business,
      });

      timeslots.push(instance);

      start.add(intervalMinutes, 'minutes');
    }
    return this.timeslotRepo.save(timeslots);
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
      existing.startTime = updateDto.startTime;
    if (updateDto.endTime !== undefined) existing.endTime = updateDto.endTime;
    if (updateDto.isAvailable !== undefined)
      // existing.isAvailable = updateDto.isAvailable;

      // Save the updated entity
      return this.timeslotRepo.save(existing);
  }

  async getAvailableDateRange(
    query: TimeslotAvailableRangeQueryDto,
  ): Promise<AvailableDateRangeDto[]> {
    const business = await this.businessService.findOne(query.businessId);
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
    const business = await this.businessService.findOne(query.businessId);
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

    const business = await this.businessService.findOne(query.businessId);
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
        date: true,
        startTime: true,
        endTime: true,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async getStatus(user: User): Promise<GetStatusResDto> {
    const now = moment().format('YYYY-MM-DD');
    const business = await this.businessService.findByUserId(user.id);

    const latestTimeSlot = await this.timeslotRepo.findOne({
      where: {
        business,
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

  async getBySchedule(scheduleId: string) {
    return this.timeslotRepo.find({
      where: {
        schedule: {
          id: scheduleId,
        },
      },
    });
  }
}
