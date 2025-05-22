// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { OtpRequestDto } from './dto/otp-request.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
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
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  // @Get('initiate-verification/:phoneNumber')
  // async initiateVerification(@Param('phoneNumber') phoneNumber: string) {
  //   // return this.authService.initiatePhoneVerification(phoneNumber);
  // }
}
