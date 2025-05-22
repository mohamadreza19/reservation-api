import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ServiceService } from './service.service';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import {
  CreateServiceDto,
  FindServicesDto,
  UpdateServiceDto,
} from './dto/service.dto';

@ApiTags('services')
@Controller('services')
@AuthWithRoles([Role.BUSINESS_ADMIN])
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 404,
    description: 'Parent service or business not found',
  })
  create(@Body() createServiceDto: CreateServiceDto, @AuthUser() user: User) {
    return this.serviceService.create(createServiceDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  findAll(@Query() dto: FindServicesDto) {
    return this.serviceService.findAll(dto);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get services by business ID' })
  @ApiResponse({
    status: 200,
    description: 'Business services retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findByBusiness(@Param('businessId') businessId: string) {
    // return this.serviceService.findByBusiness(businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 404,
    description: 'Service, parent or business not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @AuthUser() user: User,
  ) {
    // return this.serviceService.update(id, updateServiceDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    // return this.serviceService.remove(id, user);
  }

  // @Get(':id/children')
  // @ApiOperation({ summary: 'Get child services of a service' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Child services retrieved successfully',
  // })
  // @ApiResponse({ status: 404, description: 'Parent service not found' })
  // async findChildren(@Param('id') id: string) {
  //   await this.serviceService.findOne(id);
  //   return this.serviceService.findAll({
  //     businessId: undefined,
  //     parentId: id,
  //     isSystemService: undefined,
  //     rootOnly: undefined,
  //   });
  // }
}
