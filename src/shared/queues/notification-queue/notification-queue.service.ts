import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NOTIFICATION } from './constants/notification-queue.constants';

import { AuthSendOtpForEmail } from 'src/shared/types/auth-sendotp.inteface';
import { JobPriority } from 'src/shared/types/job-priority.enum';
import { NotificationJobNames } from './constants/notification-job-names-enum';
import { AppointmentReminder } from './types/appointment-remider.interface';
import { RegisterAppointment } from './types/register-appointment.interface';

@Injectable()
export class NotificationQueueService {
  constructor(
    @InjectQueue(QUEUE_NOTIFICATION) private readonly notificationQueue: Queue,
  ) {}

  async sendRegisterAppointmentNotification(data: RegisterAppointment) {
    this.notificationQueue.add(NotificationJobNames.APPOINTMENT_UPDATE, data, {
      priority: JobPriority.PRIORITY_HIGH,
      removeOnComplete: true,
    });
  }
  async sendAppointmentReminderNotification(
    data: AppointmentReminder,
    delay: number,
  ) {
    this.notificationQueue.add(
      NotificationJobNames.APPOINTMENT_REMINDER,
      data,
      {
        priority: JobPriority.PRIORITY_MEDIUM,
        removeOnComplete: true,
        delay: delay,
      },
    );
  }
  async sendOtpForEmail(data: AuthSendOtpForEmail) {
    this.notificationQueue.add(NotificationJobNames.AUTH_SENDOTP, data, {
      priority: JobPriority.PRIORITY_HIGH,
      removeOnComplete: true,
    });
  }
  async getAllJob() {
    return (await this.notificationQueue.getJobs()).map((item) => {
      return item;
    });
  }
  async removeAllJobs() {
    (await this.getAllJob()).forEach(async (job) => {
      await this.notificationQueue.remove(job.id);
    });
  }
}
