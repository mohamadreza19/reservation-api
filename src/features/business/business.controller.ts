import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/shared/dto/login.dto';
import { BusinessService } from './business.service';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}
  @Get()
  getAll() {
    return 'sdad';
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.businessService.Login(loginDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtp: VerifyOtpDto) {
    return await this.businessService.verifyOtp(verifyOtp);
  }

  @Put(':id')
  async update() {}
}
