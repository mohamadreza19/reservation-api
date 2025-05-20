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
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
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
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({ name: 'isSystemService', required: false, type: Boolean })
  @ApiQuery({ name: 'rootOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('businessId') businessId?: string,
    @Query('parentId') parentId?: string,
    @Query('isSystemService') isSystemService?: boolean,
    @Query('rootOnly') rootOnly?: boolean,
  ) {
    const filters: Record<string, any> = {};
    if (businessId) filters.businessId = businessId;
    if (parentId) filters.parentId = parentId;
    if (isSystemService !== undefined)
      filters.isSystemService = isSystemService === true;
    if (rootOnly !== undefined) filters.rootOnly = rootOnly === true;

    return this.serviceService.findAll({
      page,
      limit,
      sort,
      filters,
    });
  }

  @Get('system')
  @ApiOperation({ summary: 'Get all system services' })
  @ApiResponse({
    status: 200,
    description: 'System services retrieved successfully',
  })
  findSystemServices() {
    return this.serviceService.findSystemServices();
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get services by business ID' })
  @ApiResponse({
    status: 200,
    description: 'Business services retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findByBusiness(@Param('businessId') businessId: string) {
    return this.serviceService.findByBusiness(businessId);
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
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get child services of a service' })
  @ApiResponse({
    status: 200,
    description: 'Child services retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Parent service not found' })
  async findChildren(@Param('id') id: string) {
    // Verify parent exists
    await this.serviceService.findOne(id);
    return this.serviceService.findAll({
      filters: { parentId: id },
      relations: ['business'],
    });
  }
}
