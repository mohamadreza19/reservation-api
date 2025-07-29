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

@Injectable()
export class AuthService {
  constructor(
    public readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly businessService: BusinessService,
    private readonly customerService: CustomerService,
    private readonly otp: OtpService,
  ) {}

  async validateUser(
    phoneNumber: string,
    password: string,
  ): Promise<{ user: User }> {
    const user = await this.userService.findByPhoneNumber(phoneNumber, true);

    // Existing user with correct password
    if (user && (await bcrypt.compare(password, user.password))) {
      return { user };
    }

    // No user exists - create new one
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userService.create({
        phoneNumber,
        password: hashedPassword,
        role: Role.CUSTOMER,
      });

      return { user: newUser };
    }

    // User exists but wrong password
    throw new ConflictException('Invalid credentials');
  }

  async login(user: User, role: Role): Promise<VerifyOtpResponseDto> {
    const payload: Payload = {
      userId: user.id,
    };

    // Generate access token (15 minutes)
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token (7 days)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      isNew: user.isNew,
      role: role,
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
        phoneNumber,
        role: Role.CUSTOMER,
        userName: phoneNumber,
      });
    }
    const { expires, otp } = this.otp.generateOtp();

    await this.userService.update(user.id, {
      otpCode: otp,
      otpExpires: expires,
    });

    await this.otp.sendOtp({
      otp: otp,
      phoneNumber: user.phoneNumber,
    });

    return {
      isNew,
      expires: expires,
      otp: otp,
    };
  }
  async verifyOTP({
    otp,
    phoneNumber,
    role,
  }: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
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
    let consumer: Customer | Business | null;

    if (role == Role.CUSTOMER) {
      consumer = await this.customerService.findByUserId(user.id);
      if (!consumer) {
        consumer = await this.customerService.create({ userInfo: user });
      }
    }
    if (role == Role.BUSINESS_ADMIN) {
      consumer = await this.businessService.findByUserId(user.id);
      if (!consumer) {
        consumer = await this.businessService.create(user);
      }
    }

    // Clear OTP after successful verification

    await this.userService.update(user.id, { role });

    await this.userService.clearOTP(user.id);

    return this.login(user, role);
  }

  async adminLogin(dto: LoginDto) {
    const user = await this.userService.findByPhoneAndPass(dto);

    if (!user) throw NotFoundException;

    if (user.role !== Role.SUPER_ADMIN) {
      throw BadRequestException;
    }

    return this.login(user, Role.SUPER_ADMIN);
  }
}
