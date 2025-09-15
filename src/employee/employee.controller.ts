import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  AddServiceDto,
  EmployeeRegisterDto,
  FindRegisterRequestsDto,
  HireToBusinessDto,
  UpdateEmployeeRegisterDto,
} from './dto/employee.dto';
import { EmployeeService } from './employee.service';

import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/user/entities/user.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  findAll(@AuthUser() user: User) {
    return this.employeeService.findAll(user);
  }
  @Get('profile')
  @AuthWithRoles([Role.EMPLOYEE])
  findProfile(@AuthUser() user: User) {
    return this.employeeService.findByUser(user);
  }

  @Get('/business')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  findOne(@AuthUser() user: User) {
    return this.employeeService.findAllByBusinessUser(user);
  }
  @Get('register-request')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE])
  findAllRegisterRequests(
    @Query() query: FindRegisterRequestsDto,
    @AuthUser() user: User,
  ) {
    return this.employeeService.findRegisterRequests(user, query);
  }

  @Post('register-request')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  createRegister(@Body() dto: EmployeeRegisterDto, @AuthUser() user: User) {
    return this.employeeService.createRegisterRequest(dto, user);
  }
  @Put('register-request')
  @AuthWithRoles([Role.EMPLOYEE])
  registerRequest(
    @Body() dto: UpdateEmployeeRegisterDto,
    @AuthUser() user: User,
  ) {
    return this.employeeService.updateRegisterRequest(dto, user);
  }

  @Put(':employeeId/assign-services')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  addServices(
    @Param('employeeId') employeeId: string,
    @Body() addServiceDto: AddServiceDto,
    @AuthUser() user: User,
  ) {
    return this.employeeService.assignServices(user, addServiceDto);
  }
  @Delete(':employeeRegisterId')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE])
  terminateContract(
    @Param('employeeRegisterId') employeeRegisterId: string,
    @AuthUser() user: User,
  ) {
    return this.employeeService.deleteContract(employeeRegisterId, user);
  }
}
