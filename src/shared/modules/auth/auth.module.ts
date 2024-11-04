import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { NotificationQueueModule } from 'src/shared/queues/notification-queue/notification-queue.module';

@Module({
  imports: [NotificationQueueModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
