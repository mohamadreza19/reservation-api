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
import { BaseVerifyOtpDto } from './dto/verify-otp.dto';
import { Role } from 'src/common/enums/role.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOTP(@Body() otpRequest: OtpRequestDto) {
    return this.authService.generateAndSendOTP(otpRequest.phoneNumber);
  }

  @Post('verify-otp/customer')
  @ApiOperation({ operationId: 'AuthVerifyCustomer' })
  @ApiVerifyOtpResponse()
  async CustomerVerifyOTP(@Body() verifyOtpDto: BaseVerifyOtpDto) {
    return this.authService.verifyOTP({ ...verifyOtpDto, role: Role.CUSTOMER });
  }
  @Post('verify-otp/business')
  @ApiOperation({ operationId: 'AuthVerifyBusiness' })
  @ApiVerifyOtpResponse()
  async businessVerifyOTP(@Body() verifyOtpDto: BaseVerifyOtpDto) {
    return this.authService.verifyOTP({
      ...verifyOtpDto,
      role: Role.BUSINESS_ADMIN,
    });
  }
  @Post('verify-otp/employee')
  @ApiOperation({ operationId: 'AuthVerifyEmployee' })
  @ApiVerifyOtpResponse()
  async employeeVerifyOTP(@Body() verifyOtpDto: BaseVerifyOtpDto) {
    return this.authService.verifyOTP({
      ...verifyOtpDto,
      role: Role.EMPLOYEE,
    });
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
