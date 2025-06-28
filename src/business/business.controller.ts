import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  BusinessProfileDto,
  CreateBusinessDto,
  PublicBusinessDto,
  UpdateBusinessDto,
} from './dto/business.dto';
import { BusinessService } from './business.service';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Business } from './entities/business.entity';

// business.controller.ts

@Controller('business')
export class BusinessController {
  constructor(private readonly service: BusinessService) {}

  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @Post()
  @ApiOperation({ operationId: 'business_create' })
  create(dto: CreateBusinessDto, @AuthUser() user: User) {
    return this.service.create(user);
  }
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @Patch()
  @ApiOperation({ operationId: 'business_patch' })
  update(@Body() dto: UpdateBusinessDto, @AuthUser() user: User) {
    return this.service.update(dto, user);
  }
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @Get('profile')
  @ApiOperation({ operationId: 'business_getProfile' })
  @ApiOkResponse({
    type: BusinessProfileDto,
  })
  getProfile(@AuthUser() user: User) {
    return this.service.findByUserId(user.id);
  }
  @Get()
  getAll() {
    return this.service.findAll();
  }
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({ operationId: 'business_getMyLink' })
  @Get('my-link')
  @ApiOkResponse({
    type: 'qwer',
  })
  getMyLink(@AuthUser() user: User) {
    return this.service.getBusinessLink(user);
  }
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  // New public endpoint for guest access
  @ApiResponse({
    status: 200,
    description: 'Public business profile retrieved successfully',
    type: PublicBusinessDto,
  })
  @Get('public/:id')
  @ApiParam({ name: 'id', description: 'Business ID' })
  getPublicProfile(@Param('id') id: string) {
    return this.service.findPublicProfile(id);
  }
}
