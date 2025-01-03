import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from 'src/shared/dto/create-customer.dto';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

import { CustomerVerifyOtp } from 'src/shared/dto/customer-verify-otp';
import { LoginDto } from 'src/shared/dto/login.dto';

import { RefreshTokenDto } from 'src/shared/dto/refresh-token.dto';
import { AuthService } from 'src/shared/modules/auth/auth.service';
import { UserRole } from 'src/shared/types/user-role.enum';
import { BusinessService } from '../business/business.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @Inject(forwardRef(() => BusinessService))
    private businessService: BusinessService,
    private readonly AuthService: AuthService,
  ) {}

  async Login(loginDto: LoginDto) {
    return this.AuthService.generateOtpForPhone(loginDto.phoneNumber);
  }

  async verifyOtp(verifyOtp: CustomerVerifyOtp) {
    let isNew: boolean = false;
    let customer: Customer;
    //
    await this.AuthService.verifyOtp(verifyOtp.phoneNumber, verifyOtp.otp);

    const business = await this.businessService.findBySubDomainName(
      verifyOtp.businessSubDomainName,
    );
    customer = await this.findOneByPhoneNumber(verifyOtp.phoneNumber);

    if (!business) {
      throw new UnauthorizedException({
        message: `Can not find business By subDomain: ${verifyOtp.businessSubDomainName}`,
      });
    }

    // customer = await this.findOneByPhoneNumber(verifyOtp.phoneNumber);

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
      businessId: business.id,
    });
    return { ...tokens, isNew };
  }
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const data = await this.AuthService.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );
    const business = await this.findOneById(data.userId);

    if (!business) {
      throw new BadRequestException('No longer customer exist');
    }
    const accessToken = await this.AuthService.generateAcessToken({
      userId: business.id,
      role: UserRole.Business,
    });

    return accessToken;
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
  async findOneByEmail(email: string) {
    const result = await this.customerRepository.findOne({
      where: {
        email,
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
