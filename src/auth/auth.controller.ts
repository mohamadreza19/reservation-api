// auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './services/auth.service';

import {
  ApiRefreshTokenResponse,
  ApiVerifyOtpResponse,
} from './decorators/auth-swagger.decorator';
import { OtpRequestDto } from './dto/otp-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOTP(@Body() otpRequest: OtpRequestDto) {
    return this.authService.generateAndSendOTP(otpRequest.phoneNumber);
  }

  @Post('verify-otp')
  @ApiVerifyOtpResponse()
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @Post('refresh')
  @ApiRefreshTokenResponse()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('admin-login')
  @ApiVerifyOtpResponse()
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }
}
