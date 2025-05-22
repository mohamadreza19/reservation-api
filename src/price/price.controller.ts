import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePriceDto, UpdatePriceDto } from './dto/price-dto';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { PriceService } from './price.service';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('prices')
@Controller('prices')
@AuthWithRoles([Role.BUSINESS_ADMIN])
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a price for a non-system service' })
  @ApiResponse({ status: 201, description: 'Price created successfully' })
  create(@Body() createPriceDto: CreatePriceDto, @AuthUser() user: User) {
    return this.priceService.create(createPriceDto, user);
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get the price for a service' })
  @ApiResponse({ status: 200, description: 'Price retrieved successfully' })
  findByService(@Param('serviceId') serviceId: string, @AuthUser() user: User) {
    return this.priceService.findByService(serviceId, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a price' })
  @ApiResponse({ status: 200, description: 'Price updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDto,
    @AuthUser() user: User,
  ) {
    return this.priceService.update(id, updatePriceDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a price' })
  @ApiResponse({ status: 200, description: 'Price deleted successfully' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.priceService.remove(id, user);
  }
}
