// auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpRequestDto } from './dto/otp-request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')∏
  // async login(@Body() loginDto: LoginDto) {
  //   const { user } = await this.authService.validateUser(
  //     loginDto.phoneNumber,
  //     loginDto.password,
  //   );
  //   return this.authService.login(user);
  // }

  @Post('send-otp')
  async sendOTP(@Body() otpRequest: OtpRequestDto) {
    return this.authService.generateAndSendOTP(otpRequest.phoneNumber);
  }

  @Post('verify-otp')
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully, returns access token',
    type: VerifyOtpResponseDto,
  })
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @Post('refresh')
  @ApiResponse({
    status: 200,
    description:
      'Refresh token verified successfully, returns new access token',
    type: RefreshTokenResponseDto,
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('admin-login')
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully, returns access token',
    type: VerifyOtpResponseDto,
  })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }
}
