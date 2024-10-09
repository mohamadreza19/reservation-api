import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { LoginDto } from 'src/shared/dto/login.dto';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/types/user-role.enum';
import { UserSerializeRequest } from 'src/shared/types/user-serialize-request.interface';
import { BusinessService } from './business.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('Business-V1')
@Controller('business/v1')
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

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Business)
  @ApiBearerAuth(UserRole.Business)
  async update(
    @Req() request: UserSerializeRequest,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return await this.businessService.update(
      updateBusinessDto,
      request.user.userId,
    );
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Business)
  @ApiBearerAuth(UserRole.Business)
  async getBusinessProflie(@Req() req: UserSerializeRequest) {
    return this.businessService.findOneById(req.user.userId);
  }
  //

  // @Get(':id')

  @Delete(':id')
  deletebyId(@Param('id') id: number) {
    return this.businessService.deleteBusinessWithSchedule(id);
  }
}
