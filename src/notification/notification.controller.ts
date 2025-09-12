import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';
import { UpdateNotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notification: NotificationService) {}
  @Get()
  getAll() {}
  @Get('user')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE, Role.CUSTOMER])
  getAllUserNotification(@AuthUser() user: User) {
    return this.notification.findUserNotifications(user);
  }

  @Put()
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE, Role.CUSTOMER])
  updateAll(@Body() body: UpdateNotificationDto, @AuthUser() user: User) {}
  @Put('/:id')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.EMPLOYEE, Role.CUSTOMER])
  updateOne(@Param('id') id: string, @AuthUser() user: User) {}
}
