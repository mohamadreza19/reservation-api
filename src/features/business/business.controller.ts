import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/shared/dto/login.dto';
import { BusinessService } from './business.service';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { UserSerializeRequest } from 'src/shared/types/user-serialize-request.interface';

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
    const data = await this.businessService.verifyOtp(verifyOtp);

    return data;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('business')
  @Put(':id')
  async update(
    @Req() request: UserSerializeRequest,
    @Param('id') id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return await this.businessService.update(updateBusinessDto, request.user);
  }
}
