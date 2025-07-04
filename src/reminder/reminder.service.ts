import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReminderService {
  constructor(@InjectQueue('reminder') private reminderQueue: Queue) {}

  async scheduleReminder(
    userId: string,
    appointmentId: string,

    delay: number,
  ) {
    await this.reminderQueue.add(
      'send-reminder',
      { userId, appointmentId },
      {
        delay: delay,
        attempts: 3, // Retry if fails
        // backoff: 5000, // Retry after 5 seconds
        removeOnComplete: true,
      },
    );
  }
}
