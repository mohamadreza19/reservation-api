// appointment.controller.ts
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
import { AppointmentService } from './appointment.service';

import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import {
  CreateAppointmentDto,
  // UpdateAppointmentDto,
} from './dto/appointment.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Appointment } from './entities/appointment.entity';
import {
  AvailableDateRangeDto,
  GetTimeslotsByDate,
} from 'src/time-slot/dto/time-slot-dto';
import { GetEntityByDateByDate } from 'src/common/dto/query.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ operationId: 'appointments_create' })
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @AuthUser() user: User,
  ) {
    return this.appointmentService.create(createAppointmentDto, user);
  }

  @Get()
  @ApiOperation({ operationId: 'appointments_getAll' })
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiOkResponse({
    type: [Appointment],
  })
  getAll(
    @AuthUser() user: User,

    @Query() query: AvailableDateRangeDto,
    // @Query() query: any,
  ) {
    return this.appointmentService.getAll(query, user);
  }

  @Get('available-date')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  getAvailableDateRange(@AuthUser() user: User) {
    return this.appointmentService.getAvailableDateRange(user);
  }

  @Get('lala')
  lala() {
    return this.appointmentService.trigger();
  }
}
