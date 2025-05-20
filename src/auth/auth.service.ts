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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly businessService: BusinessService,
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
        isVerified: false,
      });
      return { user: newUser };
    }

    // User exists but wrong password
    throw new ConflictException('Invalid credentials');
  }

  async login(user: User): Promise<VerifyOtpResponseDto> {
    const payload = {
      phoneNumber: user.phoneNumber,
      sub: user.id,
      role: user.role,
      businessId: user.business?.id || null,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateAndSendOTP(phoneNumber: string): Promise<OtpResponseDto> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await this.userService.updateOrCreateOTP(phoneNumber, otp, expires);

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
    // await this.userService.clearOTP(user.id);

    return this.login(user);
  }

  async registerEmployee(
    phoneNumber: string,
    password: string,
    firstName: string,
    lastName: string,
    position: string,
    businessId: string,
    adminId: string,
  ) {
    // Verify admin has permission
    // const admin = await this.userService.findOne(adminId);
    // if (![Role.SUPER_ADMIN, Role.BUSINESS_ADMIN].includes(admin.role)) {
    //   throw new UnauthorizedException('Only admins can register employees');
    // }
    // const business = await this.businessService.findOne(businessId);
    // const hashedPassword = await bcrypt.hash(password, 10);
    // return this.userService.create({
    //   phoneNumber,
    //   password: hashedPassword,
    //   firstName,
    //   lastName,
    //   position,
    //   role: Role.EMPLOYEE,
    //   business,
    // });
  }
}
