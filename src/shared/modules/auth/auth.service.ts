// src/shared/services/shared-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from 'src/shared/services/sms.service';
import { OtpService } from '../../cache-manager/otp.service';
import { NotificationQueueService } from '../../queues/notification-queue/notification-queue.service';
import {
  CustomerPayload,
  UserPayload,
} from '../../types/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly notificationQueueService: NotificationQueueService,
    private readonly smsService: SmsService,
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
    payload: UserPayload | CustomerPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
  async generateAcessToken(
    payload: UserPayload | CustomerPayload,
  ): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    return { accessToken: accessToken };
  }

  async verifyRefreshToken(refreshTtoken: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verify(refreshTtoken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Generate  OTP
  async generateOtpForPhone(phone: string) {
    const otp = await this.otpService.generateOtp(phone);
    // const result = await this.smsService.sendOtp('+98' + phone, otp);

    return [`${otp} Send to ${phone}`];
  }
  async generateOtpForEmail(email: string) {
    const otp = await this.otpService.generateOtp(email);
    await this.notificationQueueService.sendOtpForEmail({
      email: email,
      otp,
      type: 'auth-sendotp',
    });

    return [`Otp Send to ${email}`];
  }
}
