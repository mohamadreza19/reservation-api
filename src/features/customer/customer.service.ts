import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from 'src/shared/dto/create-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OtpService } from 'src/shared/cache-manager/otp.service';
import { LoginDto } from 'src/shared/dto/login.dto';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private otpService: OtpService,
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

    const customer = await this.findOneByPhoneNumber(strPhoneNumber);

    if (!customer) {
      await this.create({
        name: verifyOtp.phoneNumber,
        phoneNumber: verifyOtp.phoneNumber,
      });
    }

    return customer;
  }
  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  async findOneByPhoneNumber(phoneNumber: string) {
    const result = await this.customerRepository.findOne({
      where: {
        phoneNumber,
      },
    });
    return result;
  }

  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
