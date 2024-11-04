import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATION } from './constants/notification-queue.constants';

import { Job } from 'bullmq';
import { EmailService } from 'src/shared/email/email.service';
import { RegisterAppointment } from './types/register-appointment.interface';
import { AppointmentReminder } from './types/appointment-remider.interface';
import { BullQmJobData } from 'src/shared/types/bull-qm-job-data.interface';
import { AuthSendOtpForEmail } from 'src/shared/types/auth-sendotp.inteface';

@Processor(QUEUE_NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    // do some stuff
  }

  @OnWorkerEvent('completed')
  async handleNotification(job: Job<BullQmJobData>) {
    const data = job.data;
    const { type } = job.data;
    switch (type) {
      case 'appointment-register':
        return await this.emailService.sendRegisterAppointment(
          data as RegisterAppointment,
        );
      case 'appointment-reminder':
        return await this.emailService.sendAppointmentReminder(
          data as AppointmentReminder,
        );
      case 'auth-sendotp':
        return await this.emailService.sendOtp(data as AuthSendOtpForEmail);
      default:
        break;
    }

    // Call the notification service to send the actual notification (e.g., email, SMS)
    // await this.notificationService.sendNotification(userId, message);
  }
}
