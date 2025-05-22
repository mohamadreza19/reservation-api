import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';

import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Controller('employee')
@AuthWithRoles([Role.BUSINESS_ADMIN])
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new employee for the authenticated user’s business',
  })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  create(@Body() createEmployeeDto: CreateEmployeeDto, @AuthUser() user: User) {
    return this.employeeService.create(createEmployeeDto, user);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get all employees for a specific business' })
  @ApiParam({ name: 'businessId', description: 'Business ID', type: String })
  @ApiResponse({ status: 200, description: 'List of employees' })
  findAllForBusiness(
    @Param('businessId') businessId: string,
    @AuthUser() user: User,
  ) {
    return this.employeeService.findAllForBusiness(businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID', type: String })
  @ApiResponse({ status: 200, description: 'Employee details' })
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', description: 'Employee ID', type: String })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @AuthUser() user: User,
  ) {
    return this.employeeService.update(id, updateEmployeeDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'id', description: 'Employee ID', type: String })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.employeeService.remove(id, user);
  }
}
