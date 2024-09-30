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
import { SharedAuthService } from 'src/shared/services/shared-auth.service';
import { UserRole } from 'src/shared/types/user-role.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly sharedAuthService: SharedAuthService,
  ) {}

  async Login(loginDto: LoginDto) {
    return this.sharedAuthService.login(loginDto.phoneNumber);
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    let isNew: boolean = false;
    let customer: Customer;
    //
    await this.sharedAuthService.verifyOtp(
      verifyOtp.phoneNumber,
      verifyOtp.otp,
    );

    customer = await this.findOneByPhoneNumber(verifyOtp.phoneNumber);

    if (!customer) {
      customer = await this.create({
        name: verifyOtp.phoneNumber,
        phoneNumber: verifyOtp.phoneNumber,
      });

      isNew = true;
    }

    const tokens = await this.sharedAuthService.generateTokens({
      userId: customer.id,
      phoneNumber: customer.phoneNumber,
    });
    return { ...tokens, isNew };
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
