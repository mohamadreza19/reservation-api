import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { BusinessService } from 'src/business/business.service';
import { UserService } from 'src/user/user.service';
import { OtpResponseDto } from './dto/otp-response.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Payload } from 'src/common/models/auth';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    public readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly businessService: BusinessService,
    private readonly customerService: CustomerService,
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

  async login(user: User): Promise<VerifyOtpResponseDto> {
    const payload: Payload = {
      userId: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      isNew: user.isNew,
      role: user.role,
    };
  }

  async generateAndSendOTP(phoneNumber: string): Promise<OtpResponseDto> {
    let user = await this.userService.findByPhoneNumber(phoneNumber);
    if (user) {
      user.isNew = false;
      this.userService.updateUserInstance(user);
    }

    if (!user) {
      // Create a temporary unverified user for OTP

      user = await this.userService.create({
        phoneNumber,
        role: Role.CUSTOMER,
        userName: phoneNumber,
      });
      await this.customerService.createByUserId(user.id);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    console.log(user);
    user.otpCode = otp;
    user.otpExpires = expires;

    await this.userService.updateUserInstance(user);
    // await this.userService.updateOrCreateOTP(phoneNumber, otp, expires);

    return {
      success: true,
      expiresAt: expires, // Optional: include expiration time in response
      otp: otp,
    };
  }
  async verifyOTP({
    otp,
    phoneNumber,
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

    // Clear OTP after successful verification

    await this.userService.clearOTP(user.id);

    return this.login(user);
  }
}
