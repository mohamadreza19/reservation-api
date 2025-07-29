// src/schedule/schedule.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateScheduleDto,
  UpdateIntervalForAllDto,
  UpdateScheduleDto,
} from './dto/schedule.dto';
import { ScheduleService } from './schedule.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/user/entities/user.entity';

@ApiTags('schedules')
@Controller('schedules')
@AuthWithRoles([Role.BUSINESS_ADMIN])
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('initiate-schedules')
  @ApiOperation({ operationId: 'schedules_initiate' })
  initiate(@AuthUser() user: User) {
    return this.scheduleService.initiateSchedules(user);
  }

  // @Post()
  // @HttpCode(201)
  // @ApiOperation({ summary: 'Create a business schedule' })
  // @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid input or overlapping schedule',
  // })
  // @ApiResponse({ status: 403, description: 'Unauthorized to create schedule' })
  // create(@Body() createScheduleDto: CreateScheduleDto, @AuthUser() user: User) {
  //   // return this.scheduleService.createSchedule(user, createScheduleDto);
  // }

  @Get()
  @ApiOperation({ operationId: 'schedules_findAll' })
  @ApiResponse({
    status: 200,
    description: 'Schedules retrieved successfully',
    type: [CreateScheduleDto],
  })
  @ApiResponse({ status: 403, description: 'Unauthorized to view schedules' })
  getSchedules(@AuthUser() user: User) {
    return this.scheduleService.getSchedules(user);
  }
  @Patch('interval-for-all')
  updateIntervalForAll(
    @AuthUser() user: User,
    @Body() data: UpdateIntervalForAllDto,
  ) {
    return this.scheduleService.updateSchedulesInterval(data, user);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'schedules_update' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized to update schedule' })
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @AuthUser() user: User,
  ) {
    return this.scheduleService.update(id, user, updateScheduleDto);
  }
}
