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

  async login(user: User): Promise<VerifyOtpResponseDto> {
    const payload: Payload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      isNew: user.isNew,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Verify refresh token
    const payload = this.jwtService.verify(refreshToken);

    // Find user
    const user = await this.userService.findOne({ id: payload.userId });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new access token (15 minutes)
    const newPayload: Payload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(newPayload);

    // Generate new refresh token (7 days)
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
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
    console.log(user);
    const result = await this.userService.save(user);
    console.log(result);
    await this.otp.sendOtp({
      otp: otp,
      phoneNumber: user.profile.phoneNumber,
    });

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
