import { BullQmJobData } from 'src/shared/types/bull-qm-job-data.interface';

export interface RegisterAppointment extends BullQmJobData {
  email: string;
  name: string;
  date: string;
  businessName: string;
}
