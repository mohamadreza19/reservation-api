import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/types/user-role.enum';
import {
  isCustomerPayload,
  UserSerializeRequest,
} from 'src/shared/types/user-serialize-request.interface';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';
import { ServiceProfileService } from './service-profile.service';

@ApiTags('ServiceProfile-V1')
@Controller('service-profile/v1')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  @Post()
  @Roles(UserRole.Business)
  @ApiBearerAuth(UserRole.Business)
  create(
    @Req() req: UserSerializeRequest,
    @Body() createServiceProfileDto: CreateServiceProfileDto,
  ) {
    return this.serviceProfileService.create(createServiceProfileDto, req.user);
  }

  @Get()
  @Roles(UserRole.Business, UserRole.Customer)
  @ApiBearerAuth(UserRole.Business)
  @ApiBearerAuth(UserRole.Customer)
  findAll(@Req() req: UserSerializeRequest) {
    switch (req.user.role) {
      case UserRole.Customer:
        return (
          isCustomerPayload(req.user) &&
          this.serviceProfileService.findAllByBusinessId(req.user.businessId)
        );

      case UserRole.Business:
        return this.serviceProfileService.findAllByBusinessId(req.user.userId);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProfileService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.Business)
  @ApiBearerAuth(UserRole.Business)
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
