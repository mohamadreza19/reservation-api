import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { BusinessService } from 'src/business/business.service';
import { Business } from 'src/business/entities/business.entity';
import { Role } from 'src/common/enums/role.enum';
import { Payload } from 'src/common/models/auth';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from '../dto/login.dto';
import { GenerateOtpResponseDto } from '../dto/otp.dto';
import { VerifyOtpResponseDto } from '../dto/verify-otp-response.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { OtpService } from './otp.service';
import { AuthEmployeeService } from './auth-employee.service';
import { AuthCustomerService } from './auth-customer.service';
import { AuthBusinessService } from './auth-business.service';

import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    public readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otp: OtpService,
    private readonly authEmployee: AuthEmployeeService,
    private readonly authCustomer: AuthCustomerService,
    private readonly authBusiness: AuthBusinessService,
  ) {}

  private generateTokenWithExpiry(
    payload: Payload,
    expiresIn: string, // e.g., '15m', '7d', '24h'
  ): { token: string; expiredAt: string } {
    const token = this.jwtService.sign(payload, { expiresIn });

    // Calculate expiration using moment
    const now = moment();
    let expiredAt: string;

    if (expiresIn.endsWith('m')) {
      const mins = parseInt(expiresIn.replace('m', ''), 10);
      expiredAt = now.add(mins, 'minutes').toISOString();
    } else if (expiresIn.endsWith('h')) {
      const hours = parseInt(expiresIn.replace('h', ''), 10);
      expiredAt = now.add(hours, 'hours').toISOString();
    } else if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn.replace('d', ''), 10);
      expiredAt = now.add(days, 'days').toISOString();
    } else {
      throw new Error('Invalid expiresIn format');
    }

    return { token, expiredAt };
  }

  async login(user: User): Promise<VerifyOtpResponseDto> {
    const payload: Payload = {
      userId: user.id,
    };

    const { token: access_token, expiredAt } = this.generateTokenWithExpiry(
      payload,
      '15m',
    );
    const { token: refresh_token } = this.generateTokenWithExpiry(
      payload,
      '7d',
    );

    return {
      access_token,
      refresh_token,
      expiredAt, // access token expiry
      isNew: user.isNew,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findOne({ id: payload.userId });

    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const { token: access_token, expiredAt } = this.generateTokenWithExpiry(
      { userId: user.id },
      '10h',
    );
    const { token: refresh_token } = this.generateTokenWithExpiry(
      { userId: user.id },
      '7d',
    );

    return {
      access_token,
      refresh_token,
      expiredAt,
    };
  }

  async generateAndSendOTP(
    phoneNumber: string,
  ): Promise<GenerateOtpResponseDto> {
    let user = await this.userService.findByPhoneNumber(phoneNumber);

    let isNew = true;
    if (user) {
      isNew = false;
    }

    if (!user) {
      user = await this.userService.create({
        profile: {
          phoneNumber: phoneNumber,
          name: phoneNumber,
        },
        role: Role.CUSTOMER,
      });
    }
    const { expires, otp } = this.otp.generateOtp();

    this.userService.addOtp(user, {
      otpCode: otp,
      otpExpires: expires,
    });

    const result = await this.userService.save(user);

    // temp
    // await this.otp.sendOtp({
    //   otp: otp,
    //   phoneNumber: user.profile.phoneNumber,
    // });

    return {
      isNew,
      expires: expires,
      otp: otp,
    };
  }
  async verifyOTP({ otp, phoneNumber, role }: VerifyOtpDto) {
    const user = await this.userService.findByPhoneNumber(
      phoneNumber,
      false,
      true,
    );

    if (!user || !user.otpCode || !user.otpExpires) {
      throw new ConflictException('OTP not found or expired');
    }

    if (user.otpCode !== otp) {
      throw new ConflictException('Invalid OTP');
    }

    if (user.otpExpires < new Date()) {
      throw new ConflictException('OTP expired');
    }

    if (role === Role.SUPER_ADMIN) {
      throw new BadRequestException("Admin'rule not allowed");
    }

    switch (role) {
      case Role.CUSTOMER:
        await this.authCustomer.ensureCustomerForUser(user);
        break;

      case Role.BUSINESS_ADMIN:
        await this.authBusiness.ensureBusinessForUser(user);
        break;

      case Role.EMPLOYEE:
        await this.authEmployee.ensureEmployeeForUser(user);
        break;
    }

    this.userService.updateRole(user, role);
    this.userService.clearOtp(user);

    await this.userService.save(user);

    return this.login(user);
  }

  async adminLogin(dto: LoginDto) {
    const user = await this.userService.findByPhoneAndPass(dto);

    if (!user) throw NotFoundException;

    if (user.role !== Role.SUPER_ADMIN) {
      throw BadRequestException;
    }

    return this.login(user);
  }
}
