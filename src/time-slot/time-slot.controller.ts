import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import { TimeslotService } from './time-slot.service';
import {
  AvailableDateRangeDto,
  GetStatusResDto,
  GetTimeslotsByDate,
  TimeslotAvailableRangeQueryDto,
  TimeslotByDateDto,
} from './dto/time-slot-dto';
import { UpdateServicesTimeSlots } from './dto/timeslot.dto';

@ApiTags('timeslots')
@Controller('timeslots')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}
  @Post()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({
    operationId: 'timeslots_create',
  })
  create(@AuthUser() user: User) {
    return this.timeslotService.generateTimeslots(user);
  }
  @Get('available-range')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiResponse({
    status: 200,
    description: 'The range of available dates',
    type: [AvailableDateRangeDto],
  })
  async getAvailableDateRange(@Query() query: TimeslotAvailableRangeQueryDto) {
    return this.timeslotService.getAvailableDateRange(query);
  }
  @Get('by-date')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.CUSTOMER])
  @ApiResponse({
    status: 200,
    description: 'List of available timeslots for the specified date',
    type: [TimeslotByDateDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  async getTimeslotsByDate(@Query() query: GetTimeslotsByDate) {
    return this.timeslotService.getTimeslotsByDate(query);
  }
  @Get('status')
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  @ApiOperation({
    operationId: 'timeslots_status',
  })
  @ApiResponse({
    type: GetStatusResDto,
  })
  getStatus(@AuthUser() user: User) {
    return this.timeslotService.getStatus(user);
  }

  @Put()
  @AuthWithRoles([Role.BUSINESS_ADMIN])
  updateByService(
    @Body() updateServicesTimeSlots: UpdateServicesTimeSlots,
    @AuthUser() user: User,
  ) {
    return this.timeslotService.updateByServices(updateServicesTimeSlots, user);
  }
}
