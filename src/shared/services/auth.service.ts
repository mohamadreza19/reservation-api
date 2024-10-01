// src/shared/services/shared-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../cache-manager/otp.service';
import { UserPayload } from '../types/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  // OTP verification logic
  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    // Use your OTP verification logic here
    // For example, calling an external service or checking a cache
    const isValid = await this.otpService.validateOtp(phoneNumber, otp);

    if (isValid) {
      return true;
    }
    throw new UnauthorizedException('Invalid OTP');
  }

  // Generate tokens after OTP verification
  async generateTokens(
    payload: UserPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  // Generate  OTP
  async generateOtp(phoneNumber: string) {
    return await this.otpService.generateOtp(phoneNumber);
  }
}
