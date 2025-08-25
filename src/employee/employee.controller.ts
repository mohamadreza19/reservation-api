import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  AddServiceDto,
  EmployeeRegisterDto,
  HireToBusinessDto,
} from './dto/employee.dto';

import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('/business')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  findOne(@AuthUser() user: User) {
    return this.employeeService.findAllBusinessEmployees(user);
  }

  @Put('add-services')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  addServices(@Body() addServiceDto: AddServiceDto, @AuthUser() user: User) {
    return this.employeeService.addServices(user, addServiceDto);
  }
  @Put('register-request')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  registerRequest(@Body() dto: EmployeeRegisterDto, @AuthUser() user: User) {
    return this.employeeService.createRegisterRequest(dto, user);
  }

  @Put('hire-to-business')
  @AuthWithRoles([Role.CUSTOMER])
  hireToBusiness(@Body() dto: HireToBusinessDto, @AuthUser() user: User) {
    return this.employeeService.hireToBusiness(dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
