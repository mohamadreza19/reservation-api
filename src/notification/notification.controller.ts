import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthWithRoles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthUser } from 'src/common/decorators/business.decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(private notification: NotificationService) {}
  @Get()
  getAll() {}
  @Get('user')
  @AuthWithRoles([Role.BUSINESS_ADMIN, Role.BUSINESS_EMPLOYEE, Role.CUSTOMER])
  getAllUserNotification(@AuthUser() user: User) {
    return this.notification.getAllUserNotifications(user);
  }
}
