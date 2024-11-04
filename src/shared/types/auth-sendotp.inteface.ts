import { BullQmJobData } from './bull-qm-job-data.interface';

export interface AuthSendOtpForEmail extends BullQmJobData {
  email: string;
  otp: string;
}
