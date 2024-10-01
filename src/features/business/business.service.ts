import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';

import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { LoginDto } from 'src/shared/dto/login.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { AuthService } from 'src/shared/services/auth.service';

import { UpdateBusinessDto } from './dto/update-business.dto';
import { UserPayload } from 'src/shared/types/user-payload.interface';
import { BusinessCategoryService } from '../business-category/business-category.service';
import { UserRole } from 'src/shared/types/user-role.enum';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
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
    const business = this.businessRepository.create({
      ...createBusinessDto,
    });
    return await this.businessRepository.save(business);
  }
  async update(updateBusinessDto: UpdateBusinessDto, user: UserPayload) {
    const business = await this.businessRepository.findOne({
      where: {
        id: user.userId,
      },
    });
    if (!business) {
      throw new UnauthorizedException('Unauthorized');
    }
    Object.assign(business, updateBusinessDto);

    await this.updateRelations(business, updateBusinessDto);

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
    const business = await this.businessRepository.findOne({
      where: {
        id,
      },
    });

    if (!business)
      throw new UnauthorizedException(
        'You are not authorized to perform this action. Business not found.',
      );

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
}
