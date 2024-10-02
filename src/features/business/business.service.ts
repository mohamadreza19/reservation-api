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

import { UserRole } from 'src/shared/types/user-role.enum';
import { BusinessCategoryService } from '../business-category/business-category.service';
import { BusinesScheduleService } from './business-schedule/busines-schedule.service';
import { UpdateBusinessScheduleDto } from './business-schedule/dto/update-business-schedule.dto';
import { BusinessSchedule } from './business-schedule/entities/business-schedule.entity';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private businesScheduleService: BusinesScheduleService,
    private businessCategoryService: BusinessCategoryService,
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

    const tokens = await this.AuthService.generateTokens({
      userId: business.id,

      role: UserRole.Business,
    });
    return { ...tokens, isNew };
  }
  async create(createBusinessDto: CreateBusinessDto) {
    const businessSchedule =
      await this.businesScheduleService.createInitalInstance();

    const business = this.businessRepository.create({
      ...createBusinessDto,
      businessSchedule,
    });
    return await this.businessRepository.save(business);
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
    return await this.businesScheduleService.updateBusinessSchedule(
      updateBusinessScheduleDto,
      businessId,
    );
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
    const business = await this.businessRepository.findOne({
      where: {
        id,
      },
    });

    return business;
  }

  private async updateRelations(
    business: Business,
    updateBusinessDto: UpdateBusinessDto,
  ) {
    // به‌روزرسانی رابطه BusinessCategory
    if (updateBusinessDto.businessCategoryId === 0)
      throw new NotFoundException('Business category not found');

    if (updateBusinessDto.businessCategoryId) {
      const businessCategory = await this.businessCategoryService.findOneById(
        updateBusinessDto.businessCategoryId,
      );

      if (!businessCategory) {
        throw new NotFoundException('Business category not found');
      }
      business.businessCategory = businessCategory;
    }

    // به‌روزرسانی رابطه‌های دیگر (مثال: employees)
    // if (updateBusinessDto.employeeIds) {
    //   const employees = await this.employeeService.findByIds(updateBusinessDto.employeeIds);
    //   business.employees = employees;
    // }

    // // به‌روزرسانی رابطه‌های دیگر (مثال: serviceProfiles)
    // if (updateBusinessDto.serviceProfileIds) {
    //   const serviceProfiles = await this.serviceProfileService.findByIds(updateBusinessDto.serviceProfileIds);
    //   business.serviceProfiles = serviceProfiles;
  }
  async deleteBusinessWithSchedule(businessId: number) {
    // Using Transaction
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
          await transactionalEntityManager.delete(
            BusinessSchedule,
            business.businessSchedule.id,
          );
        }

        // Now delete the Business
        await transactionalEntityManager.delete(Business, business.id);

        return {
          message: 'Business and associated schedule deleted successfully',
        };
      },
    );
  }
}
