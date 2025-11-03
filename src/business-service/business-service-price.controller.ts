import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import { CreateBusinessServicePriceDto } from './dto/create-business-service-price.dto';
import { BusinessServicePriceService } from './business-service-price.service';
import { UpdateBusinessServicePriceDto } from './dto/update-business-service-price.dto';

@Controller('business-service-price')
export class BusinessServicePriceController {
  constructor(private readonly service: BusinessServicePriceService) {}

  @Post()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  create(@AuthUser() user: User, @Body() dto: CreateBusinessServicePriceDto) {
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessServicePriceDto,
  ) {
    return this.service.update(user.id, id, dto);
  }
}
