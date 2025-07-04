import * as moment from 'moment';

export interface ReminderTime {
  reminderTime: moment.Moment;
  delay: number;
}

export class TimeUtil {
  /**
   * Calculate reminder time and delay for a given appointment time
   * @param appointmentDateTime - The appointment date and time
   * @param minutesBefore - Minutes before appointment to send reminder
   * @returns ReminderTime object with reminder time and delay in milliseconds
   */
  static calculateReminderTime(
    appointmentDateTime: string | Date | moment.Moment,
    minutesBefore: number,
  ): ReminderTime {
    const appointmentMoment = moment(appointmentDateTime);
    const reminderTime = appointmentMoment
      .clone()
      .subtract(minutesBefore, 'minutes');
    const now = moment();
    const delay = reminderTime.diff(now);

    return {
      reminderTime,
      delay,
    };
  }

  /**
   * Check if a reminder should be scheduled (delay > 0)
   * @param delay - Delay in milliseconds
   * @returns boolean indicating if reminder should be scheduled
   */
  static shouldScheduleReminder(delay: number): boolean {
    return delay > 0;
  }

  /**
   * Format appointment time for display
   * @param appointmentDateTime - The appointment date and time
   * @returns Formatted string for display
   */
  static formatAppointmentTime(
    appointmentDateTime: string | Date | moment.Moment,
  ): string {
    return moment(appointmentDateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Create appointment datetime from date and time strings
   * @param date - Date string (YYYY-MM-DD)
   * @param time - Time string (HH:mm:ss)
   * @returns Moment object representing the appointment datetime
   */
  static createAppointmentDateTime(date: string, time: string): moment.Moment {
    return moment(`${date}T${time}`);
  }
}
