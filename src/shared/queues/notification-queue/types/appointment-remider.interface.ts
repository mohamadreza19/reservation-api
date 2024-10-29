import { BullQmJobData } from 'src/shared/types/bull-qm-job-data.interface';

export interface AppointmentReminder extends BullQmJobData {
  email: string;
  name: string;
  appointmentDate: string;
  businessName: string;
  message: string;
}
