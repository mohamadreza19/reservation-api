import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from 'src/shared/dto/create-customer.dto';

import { LoginDto } from 'src/shared/dto/login.dto';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { AuthService } from 'src/shared/services/auth.service';
import { UserRole } from 'src/shared/types/user-role.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly AuthService: AuthService,
  ) {}

  async Login(loginDto: LoginDto) {
    return this.AuthService.generateOtp(loginDto.phoneNumber);
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    let isNew: boolean = false;
    let customer: Customer;
    //
    await this.AuthService.verifyOtp(verifyOtp.phoneNumber, verifyOtp.otp);

    customer = await this.findOneByPhoneNumber(verifyOtp.phoneNumber);

    if (!customer) {
      customer = await this.create({
        name: verifyOtp.phoneNumber,
        phoneNumber: verifyOtp.phoneNumber,
      });

      isNew = true;
    }

    const tokens = await this.AuthService.generateTokens({
      userId: customer.id,
      role: UserRole.Customer,
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

  async findOneById(id: number) {
    return await this.customerRepository.findOne({
      where: {
        id: id,
      },
    });
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
