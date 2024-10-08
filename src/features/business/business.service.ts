import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Business } from './entities/business.entity';

import { LoginDto } from 'src/shared/dto/login.dto';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { AuthService } from 'src/shared/services/auth.service';
import { CreateBusinessDto } from './dto/create-business.dto';

import moment from 'moment';
import { UserRole } from 'src/shared/types/user-role.enum';
import { BusinessCategoryService } from '../business-category/business-category.service';
import { UpdateBusinessScheduleDto } from './business-schedule/dto/update-business-schedule.dto';
import { BusinessSchedule } from './business-schedule/entities/business-schedule.entity';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import { Cron, CronExpression } from '@nestjs/schedule';

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
    const otp = await this.AuthService.generateOtp(loginDto.phoneNumber);

    return otp;
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    let isNew: boolean = false;
    let business: Business;
    const isValid = await this.AuthService.verifyOtp(
      verifyOtp.phoneNumber,
      verifyOtp.otp,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    // Issue JWT Token after successful OTP verification

    business = await this.findOneByPhoneNumber(verifyOtp.phoneNumber);

    if (!business) {
      business = await this.create({
        name: verifyOtp.phoneNumber,
        phoneNumber: verifyOtp.phoneNumber,
      });
      isNew = true;
    }
    const date = new Date();
    await this.timeSlotsService.generateJalalianWeeklyTimeSlots(
      business.businessSchedule,
      business.id,
      date,
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
  async update(updateBusinessDto: UpdateBusinessDto, userId: number) {
    return await this.businessRepository.update(
      {
        id: userId,
      },
      updateBusinessDto,
    );
  }
  async updateBusinessScheduleByBusinessId(
    updateBusinessScheduleDto: UpdateBusinessScheduleDto,
    businessId: number,
  ) {
    const busines = await this.findOneById(businessId);

    busines.businessSchedule = {
      ...busines.businessSchedule,
      ...updateBusinessScheduleDto,
    };
    return await this.businessRepository.save(busines);
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

  async generateTimeSlots(businessId: number) {
    const business = await this.findOneById(businessId);
    const date = new Date();
    if (!business.businessSchedule) {
      throw new NotFoundException('BusinessSchedule is null');
    }
    return this.timeSlotsService.generateTimeSlots(
      business.businessSchedule,
      date,
    );
  }
  async getTimeSlotsWeeklyBasedDate(
    businessId: number,
    weekStartDate: string | undefined,
  ) {
    const date = weekStartDate
      ? moment(weekStartDate).toDate()
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
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async generateTimeSlotsWeeklyForBusiness() {
    const saturday = moment().add(1, 'days');

    const nextSaturday = saturday.clone().add(7, 'days');
    const business = await this.businessRepository.find();
    [saturday, nextSaturday].forEach(async (momentDate) => {
      const date = momentDate.toDate();

      business.forEach(async (business) => {
        await this.timeSlotsService.generateJalalianWeeklyTimeSlots(
          business.businessSchedule,
          business.id,
          date,
        );
      });
    });
  }
}
