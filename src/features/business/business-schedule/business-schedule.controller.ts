import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/types/user-role.enum';
import { UserSerializeRequest } from 'src/shared/types/user-serialize-request.interface';
import { BusinessService } from '../business.service';
import { UpdateBusinessScheduleDto } from './dto/update-business-schedule.dto';
@ApiTags('Business-V1')
@Controller('business/business-schedule/v1')
@UseGuards(JwtAuthGuard, RolesGuard) // Guards applied to all routes in this controller
@Roles(UserRole.Business)
@ApiBearerAuth(UserRole.Business)
export class BusinessScheduleController {
  constructor(private readonly businessService: BusinessService) {}

  @Patch()
  update(
    @Req() req: UserSerializeRequest,
    @Body() updateBusinessScheduleDto: UpdateBusinessScheduleDto,
  ) {
    return this.businessService.updateBusinessScheduleByBusinessId(
      updateBusinessScheduleDto,
      req.user.userId,
    );
  }
}
