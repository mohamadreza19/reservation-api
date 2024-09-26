import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';
import { OtpService } from 'src/shared/cache-manager/otp.service';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { LoginDto } from 'src/shared/dto/login.dto';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async Login(loginDto: LoginDto) {
    const otp = await this.otpService.generateOtp(loginDto.phoneNumber);

    return otp;
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const strPhoneNumber = verifyOtp.phoneNumber;
    const strOtp = verifyOtp.otp;
    const isValid = await this.otpService.validateOtp(strPhoneNumber, strOtp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    // Issue JWT Token after successful OTP verification

    const business = await this.findOneByPhoneNumber(strPhoneNumber);

    if (!business) {
      await this.create({
        name: verifyOtp.phoneNumber,
        phoneNumber: verifyOtp.phoneNumber,
      });
    }

    return business;
  }
  async create(createBusinessDto: CreateBusinessDto) {
    const business = this.businessRepository.create(createBusinessDto);
    return await this.businessRepository.save(business);
  }
  async edit() {}
  async findOneByPhoneNumber(phoneNumber: string) {
    const result = await this.businessRepository.findOne({
      where: {
        phoneNumber,
      },
    });
    return result;
  }
}
