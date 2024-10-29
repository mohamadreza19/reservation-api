import { Module } from '@nestjs/common';
import { NotificationQueueService } from './notification-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATION } from './constants/notification-queue.constants';
import { NotificationProcessor } from './notification-queue.processor';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NOTIFICATION, // Queue registration for BullMQ
      connection: {},
    }),
    EmailModule,
  ],
  providers: [NotificationQueueService, NotificationProcessor],
  exports: [NotificationQueueService],
})
export class NotificationQueueModule {}
