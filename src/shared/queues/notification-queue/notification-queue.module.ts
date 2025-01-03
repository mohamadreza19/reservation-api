import { Module } from '@nestjs/common';
import { NotificationQueueService } from './notification-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATION } from './constants/notification-queue.constants';
import { NotificationProcessor } from './notification-queue.processor';
import { EmailModule } from 'src/shared/email/email.module';
import { SmsService } from 'src/shared/services/sms.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NOTIFICATION,
    }),
    EmailModule,
  ],
  providers: [NotificationQueueService, NotificationProcessor, SmsService],
  exports: [NotificationQueueService],
})
export class NotificationQueueModule {}
