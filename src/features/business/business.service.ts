import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Business } from './entities/business.entity';

import { LoginDto } from 'src/shared/dto/login.dto';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';

import { CreateBusinessDto } from './dto/create-business.dto';

import moment from 'moment-jalaali';
import { UserRole } from 'src/shared/types/user-role.enum';
import { BusinessCategoryService } from '../business-category/business-category.service';
import { UpdateBusinessScheduleDto } from './business-schedule/dto/update-business-schedule.dto';
import { BusinessSchedule } from './business-schedule/entities/business-schedule.entity';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import _ from 'lodash';
import {
  findStartDayAndEndDayOfJalaaliWeek,
  getUpdatedBusinessScheduleFlags,
} from 'src/shared/utils';
import { TimeSlotStatus } from 'src/shared/types/time-slot-status.enum';
import { TimeSlot } from '../time-slots/entities/time-slot.entity';
import { AuthService } from 'src/shared/modules/auth/auth.service';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private businessCategoryService: BusinessCategoryService,
    private timeSlotsService: TimeSlotsService,
    private readonly AuthService: AuthService,
  ) {}

  async Login(loginDto: LoginDto) {
    const otp = await this.AuthService.generateOtpForEmail(loginDto.email);

    return otp;
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    let isNew: boolean = false;
    let business: Business;
    const isValid = await this.AuthService.verifyOtp(
      verifyOtp.email,
      verifyOtp.otp,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    // Issue JWT Token after successful OTP verification

    business = await this.findOneByPhoneNumber(verifyOtp.email);

    if (!business) {
      business = await this.create({
        name: verifyOtp.email,
        phoneNumber: verifyOtp.email,
      });
      isNew = true;
    }
    const currentDate = moment();
    const lastTimeSlot = await this.timeSlotsService.getLastTimeSlot();

    if (!lastTimeSlot) {
      throw InternalServerErrorException;
    }
    const lastTimeSlotDate = moment(lastTimeSlot.date, 'YYYY-MM-DD');

    await this.timeSlotsService.createWeeklyTimeSlots(
      business.businessSchedule,
      business.id,
      currentDate,
      lastTimeSlotDate,
      [],
    );
    const tokens = await this.AuthService.generateTokens({
      userId: business.id,

      role: UserRole.Business,
    });
    return { ...tokens, isNew };
  }
  async create(createBusinessDto: CreateBusinessDto) {
    const businessSchedule = new BusinessSchedule();
    const business = this.businessRepository.create({
      ...createBusinessDto,
      businessSchedule: businessSchedule,
    });
    return await this.businessRepository.save(business, {});
  }
  async update(updateBusinessDto: UpdateBusinessDto, businessId: number) {
    // return await this.businessRepository.update(
    //   {
    //     id: userId,
    //   },
    //   updateBusinessDto,
    // );
  }
  async updateTimeSlotStatusById(timeSlot: TimeSlot, status: TimeSlotStatus) {
    return this.timeSlotsService.updateTimeSlotStatusById(timeSlot, status);
  }
  async updateBusinessScheduleByBusinessId(
    updateBusinessScheduleDto: UpdateBusinessScheduleDto,
    businessId: number,
  ) {
    console.time('Async Process');
    const business = await this.findOneById(businessId);

    const flags = getUpdatedBusinessScheduleFlags(
      updateBusinessScheduleDto,
      business.businessSchedule,
    );

    if (flags.isHolidayUpdated) {
      await this.timeSlotsService.updateHolidays(
        businessId,
        updateBusinessScheduleDto.holidays,
      );
    }

    if (flags.isTimeIntervalUpdated || flags.isWorkingHourUpdated) {
      business.businessSchedule = {
        ...business.businessSchedule,
        ...updateBusinessScheduleDto,
      };

      await this.timeSlotsService.updateTimeInterval(
        business.businessSchedule,
        businessId,
      );
    }
    console.timeEnd('Async Process');
    return await this.businessRepository.save(business);
  }

  async findOneByPhoneNumber(phoneNumber: string) {
    const result = await this.businessRepository.findOne({
      where: {
        phoneNumber,
      },
    });
    return result;
  }
  async findOneById(id: number) {
    return await this.businessRepository.findOne({
      where: {
        id,
      },
    });
  }
  async findTimeSlotById(timeSlotId: number) {
    return await this.timeSlotsService.findOneById(timeSlotId);
  }

  async deleteBusinessWithSchedule(businessId: number) {
    // Using Transaction

    // One To One Problem
    return await this.businessRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // Find the Business and its associated BusinessSchedule
        const business = await transactionalEntityManager.findOne(Business, {
          where: { id: businessId },
          relations: ['businessSchedule'],
        });

        if (!business) {
          throw new Error('Business not found');
        }

        // Manually delete the BusinessSchedule first
        if (business.businessSchedule) {
          // const employees = business.employees
          await transactionalEntityManager.delete(Business, business.id);
          await transactionalEntityManager.delete(
            BusinessSchedule,
            business.businessSchedule.id,
          );
        }

        // Now delete the Business

        return {
          message: 'Business and associated schedule deleted successfully',
        };
      },
    );
  }

  async getTimeSlotsWeeklyBasedDate(
    businessId: number,
    weekStartDate: string | undefined,
  ) {
    const date = weekStartDate
      ? moment.utc(weekStartDate).toDate()
      : moment().toDate();

    return await this.timeSlotsService.getTimeSlotWeekly(businessId, date);
  }

  async findBySubDomainName(subDomainName: string) {
    return await this.businessRepository.findOne({
      where: {
        subDomainName,
      },
    });
  }

  // @Cron('0 0 0 14 * *')
  // @Interval(1000 * 60 * 60 * 24 * 14) // 1000 ms * 60 * 60 * 24 * 14 days
  // @Interval(1000 * 60 * 1)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async generateTimeSlotsWeeklyForBusiness() {
    const saturday = moment().add(1, 'days');
    console.log('meow');
    const nextSaturday = saturday.clone().add(7, 'days');
    const business = await this.businessRepository.find();
    [saturday, nextSaturday].forEach(async (momentDate) => {
      const [startDayOfWeek, endDayOfWeek] =
        findStartDayAndEndDayOfJalaaliWeek(momentDate);

      business.forEach(async (business) => {
        await this.timeSlotsService.createWeeklyTimeSlots(
          business.businessSchedule,
          business.id,
          startDayOfWeek,
          endDayOfWeek,
          [],
        );
      });
    });
  }
}
