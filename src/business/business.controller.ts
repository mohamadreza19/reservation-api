import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { BusinessService } from './business.service';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import { ApiParam } from '@nestjs/swagger';

// business.controller.ts

@Controller('business')
@AuthWithRoles([Role.BUSINESS_ADMIN])
export class BusinessController {
  constructor(private readonly service: BusinessService) {}

  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @Post()
  create(@Body() dto: CreateBusinessDto, @AuthUser() user: User) {
    console.log('27', user);
    return this.service.create(dto, user);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: false, description: 'Business ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessDto,
    @AuthUser() user: User,
  ) {
    return this.service.update(dto, user);
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
