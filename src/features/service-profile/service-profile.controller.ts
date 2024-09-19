import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';

@Controller('service-profile')
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  @Post()
  create(@Body() createServiceProfileDto: CreateServiceProfileDto) {
    return this.serviceProfileService.create(createServiceProfileDto);
  }

  @Get()
  findAll() {
    return this.serviceProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceProfileDto: UpdateServiceProfileDto) {
    return this.serviceProfileService.update(+id, updateServiceProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceProfileService.remove(+id);
  }
}
