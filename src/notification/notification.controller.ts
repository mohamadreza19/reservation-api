import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import { NotificationFilterDto } from './dto/notification-filter.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';
// import { UpdateNotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notification: NotificationService) {}
  @Get()
  getAll() {}

  @Get('user')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE, Role.CUSTOMER])
  @ApiOperation({
    operationId: 'get_notification',
  })
  @ApiResponse({
    type: [NotificationDto],
  })
  getAllUserNotification(
    @AuthUser() user: User,

    // @Query() query: NotificationFilterDto,
  ) {
    return this.notification.findUserNotifications(user.id);
  }

  @Put('mark-all-as-read')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE, Role.CUSTOMER])
  @ApiOperation({
    operationId: 'mark-all-as-read_notification',
  })
  updateAll(@AuthUser() user: User) {
    return this.notification.markAllAsRead(user.id);
  }
}
