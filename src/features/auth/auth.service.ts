import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { CreateAuthDto } from './dto/validate-phone.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OtpService } from './otp.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}
  async login(phoneNumber: string): Promise<string> {
    const otp = await this.otpService.generateOtp(phoneNumber);
    // Here you would send the OTP (via SMS, Email, etc.)
    return otp; // In production, return a success message instead
  }

  async verifyOtp(phoneNumber: number, otp: number): Promise<boolean> {
    const strPhoneNumber = phoneNumber.toString();
    const strOtp = otp.toString();
    const isValid = await this.otpService.validateOtp(strPhoneNumber, strOtp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    // Issue JWT Token after successful OTP verification
    return true;
  }
}
