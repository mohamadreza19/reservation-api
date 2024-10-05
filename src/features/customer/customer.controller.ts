import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerVerifyOtp } from 'src/shared/dto/customer-verify-otp';
import { LoginDto } from 'src/shared/dto/login.dto';
import { CustomerService } from './customer.service';
@ApiTags('Customer-V1')
@Controller('customer/v1')
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
  async verifyOtp(@Body() verifyOtpDto: CustomerVerifyOtp) {
    return await this.customerService.verifyOtp(verifyOtpDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.customerService.findOne(+id);
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
