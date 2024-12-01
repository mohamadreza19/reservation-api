import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetQueryAppointmentsDto } from './dto/get-query-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Roles(UserRole.Customer, UserRole.Business)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth(UserRole.Customer)
@ApiBearerAuth(UserRole.Business)
@ApiTags('Appointment-V1')
@Controller('appointment/v1')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Req() req: UserSerializeRequest,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const user = req.user;

    return isCustomerPayload(user)
      ? this.appointmentService.create(
          createAppointmentDto,
          user.businessId,
          user.userId,
        )
      : BadRequestException;
  }

  @Get()
  async findAll(
    @Req() req: UserSerializeRequest,
    @Query() query: GetQueryAppointmentsDto,
  ) {
    return await this.appointmentService._findAppointment(req.user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
