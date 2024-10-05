import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth-guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/types/user-role.enum';
import {
  isCustomerPayload,
  UserSerializeRequest,
} from 'src/shared/types/user-serialize-request.interface';
import { BusinessService } from '../business.service';
import { GetTimeSlotDto } from './dto/get-time-slots.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Customer, UserRole.Business)
@ApiTags('Business-V1')
@ApiBearerAuth(UserRole.Customer)
@ApiBearerAuth(UserRole.Business)
@Controller('business/time-slots')
export class TimeSlotsController {
  constructor(private readonly businessService: BusinessService) {}
  @Get()
  findAll(@Req() req: UserSerializeRequest, @Query() query: GetTimeSlotDto) {
    // return this.businessService.generateTimeSlots(req.user.userId);
    const user = req.user;
    return isCustomerPayload(user)
      ? this.businessService.generateTimeSlots2(
          user.businessId,
          query.weekStartDate,
        )
      : this.businessService.generateTimeSlots2(
          user.userId,
          query.weekStartDate,
        );
  }
}
