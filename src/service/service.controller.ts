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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ServiceService } from './service.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProperty,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import {
  CreateServiceDto,
  FindServiceByBusiness,
  FindServicesDto,
  PaginatedServiceDto,
  ServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { MulterConfig } from 'src/file/config/multer-config';
import { StorageProfile } from 'src/file/config/file.config';

class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Icon file for the service (JPEG, PNG, SVG)',
    required: false,
  })
  icon?: any; // Swagger doesn't support Express.Multer.File directly
}

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Post()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @HttpCode(201)
  @ApiOperation({ operationId: 'services_create' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({
    status: 404,
    description: 'Parent service or business not found',
  })
  create(@Body() createServiceDto: CreateServiceDto, @AuthUser() user: User) {
    return this.serviceService.create(createServiceDto, user);
  }

  @Get()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({ operationId: 'services_findAll' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
    type: PaginatedServiceDto,
  })
  findAll(@Query() dto: FindServicesDto, @AuthUser() user: User) {
    return this.serviceService.findAll(user, dto);
  }

  @Get('system')
  get() {
    // return this.serviceService.findSystemServices();
  }

  @Get('business/:businessId')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiOperation({ operationId: 'services_findByBusiness' })
  @ApiResponse({
    status: 200,
    description: 'Business services retrieved successfully',
    type: PaginatedServiceDto,
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findByBusiness(
    @Param('businessId') businessId: string,
    @Query()
    query: FindServiceByBusiness,
  ) {
    return this.serviceService.findSystemServices(businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({ operationId: 'services_update' })
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
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({ operationId: 'services_delete' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.serviceService.remove(id, user);
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
