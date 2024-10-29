import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplateNames } from '../types/email-template-names-enum';
import { RegisterAppointment } from '../queues/notification-queue/types/register-appointment.interface';
import { AppointmentReminder } from '../queues/notification-queue/types/appointment-remider.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(
    to: string,
    name: string,
    email: string,
  ): Promise<void> {
    return await this.mailerService.sendMail({
      to, // The recipient's email
      subject: 'Welcome to Our Platform!', // Email subject
      template: EmailTemplateNames.WELCOME, // The name of the template (without the .hbs extension)
      context: {
        name, // Dynamic value for the {{name}} placeholder in the template
        email, // Dynamic value for the {{email}} placeholder in the template
      },
    });
  }
  async sendRegisterAppointment(data: RegisterAppointment): Promise<void> {
    return await this.mailerService.sendMail({
      to: data.email, // The recipient's email
      subject: 'ثبت رزرو', // Email subject
      template: EmailTemplateNames.REGISTER_APPOINTMENT, // The name of the template (without the .hbs extension)
      context: data,
    });
  }
  async sendAppointmentReminder(data: AppointmentReminder): Promise<void> {
    return await this.mailerService.sendMail({
      to: data.email, // The recipient's email
      subject: 'یادآوری ملاقات', // Email subject
      template: EmailTemplateNames.APPOINTMENT_REMINDER, // The name of the template (without the .hbs extension)
      context: data,
    });
  }
}
