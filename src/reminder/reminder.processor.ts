import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointment/entities/appointment.entity';
import { AppointmentStatus } from '../appointment/constants/const';

@Processor('reminder')
export class ReminderProcessor {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  @Process('send-reminder')
  async handleReminder(job: Job) {
    const { appointmentId } = job.data;

    // Here you send a notification, email, etc.

    if (appointmentId) {
      await this.appointmentRepo.update(
        { id: appointmentId },
        { status: AppointmentStatus.Done },
      );
    }
  }
}
