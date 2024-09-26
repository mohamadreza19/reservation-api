import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/shared/dto/login.dto';
import { VerifyOtpDto } from 'src/shared/dto/verify-otp';
import { JwtService } from '@nestjs/jwt';
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post()
  // create(@Body() createCustomerDto: CreateCustomerDto) {
  //   return this.customerService.create(createCustomerDto);
  // }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.customerService.Login(loginDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.customerService.verifyOtp(verifyOtpDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
  //   return this.customerService.update(+id, updateCustomerDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
