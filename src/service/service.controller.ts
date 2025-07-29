import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';

import {
  ApiServiceCreateResponse,
  ApiServiceDeleteResponse,
  ApiServiceFindAllPlansResponse,
  ApiServiceFindAllResponse,
  ApiServiceFindByBusinessResponse,
  ApiServiceFindOneResponse,
  ApiServiceUpdateResponse,
} from './decorators/service-swagger.decorator';

import { ApiTags } from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import {
  CreateServiceDto,
  FindServiceByBusiness,
  FindServicesDto,
  UpdateServiceDto,
} from './dto/service.dto';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Post()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @HttpCode(201)
  @ApiServiceCreateResponse()
  create(@Body() createServiceDto: CreateServiceDto, @AuthUser() user: User) {
    return this.serviceService.create(createServiceDto, user);
  }

  @Get()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiServiceFindAllResponse()
  findAll(@Query() dto: FindServicesDto, @AuthUser() user: User) {
    return this.serviceService.findAll(user, dto);
  }

  @Get('plans')
  @ApiServiceFindAllPlansResponse()
  get() {
    return this.serviceService.findAllPlans();
  }

  @Get('business/:businessId')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiServiceFindByBusinessResponse()
  findByBusiness(
    @Param('businessId') businessId: string,
    @Query() query: FindServiceByBusiness,
  ) {
    return this.serviceService.findSystemServices(businessId, query);
  }

  @Get(':id')
  @ApiServiceFindOneResponse()
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiServiceUpdateResponse()
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @AuthUser() user: User,
  ) {
    return this.serviceService.updateById(id, updateServiceDto, user);
  }

  @Delete(':id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiServiceDeleteResponse()
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.serviceService.remove(id, user);
  }
}
