import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BusinessServiceService } from './business-service.service';
import { CreateBusinessServiceDto } from './dto/create-business-service.dto';
import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import { FindAllBusinessServiceDto } from './dto/find-all-business-service.dto';

@Controller('business-service')
export class BusinessServiceController {
  constructor(
    private readonly businessServiceService: BusinessServiceService,
  ) {}

  @Post()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  create(
    @AuthUser() user: User,
    @Body() createBusinessServiceDto: CreateBusinessServiceDto,
  ) {
    return this.businessServiceService.create(
      user.id,
      createBusinessServiceDto,
    );
  }

  @Get()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  findAll(@AuthUser() user: User, @Query() query: FindAllBusinessServiceDto) {
    return this.businessServiceService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessServiceService.findOne(id);
  }

  @Patch(':id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateBusinessServiceDto: UpdateBusinessServiceDto,
  ) {
    return this.businessServiceService.update(
      user.id,
      id,
      updateBusinessServiceDto,
    );
  }

  @Delete(':id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.businessServiceService.remove(user.id, id);
  }
}
