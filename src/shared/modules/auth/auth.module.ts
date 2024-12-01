import { Module } from '@nestjs/common';

import { NotificationQueueModule } from 'src/shared/queues/notification-queue/notification-queue.module';
import { SmsService } from 'src/shared/services/sms.service';
import { AuthService } from './auth.service';

@Module({
  imports: [NotificationQueueModule],
  providers: [AuthService, SmsService],
  exports: [AuthService],
})
export class AuthModule {}
