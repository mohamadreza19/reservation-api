import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { UserSerializeRequest } from 'src/shared/types/user-serialize-request.interface';

@ApiTags('ServiceProfile-V1')
@Controller('service-profile/v1')
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  @ApiBearerAuth('business')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: UserSerializeRequest,
    @Body() createServiceProfileDto: CreateServiceProfileDto,
  ) {
    return this.serviceProfileService.create(createServiceProfileDto, req.user);
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
  update(
    @Param('id') id: string,
    @Body() updateServiceProfileDto: UpdateServiceProfileDto,
  ) {
    return this.serviceProfileService.update(+id, updateServiceProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceProfileService.remove(+id);
  }
}
