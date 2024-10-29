import moment, { Moment } from 'moment';
import { ReminderDetails } from '../types';

/**
 * Calculate valid reminder delays based on current time.
 * Delays are considered valid if:
 *  - 15 minutes before the time slot
 *  - 1 day before the time slot
 *
 * @param timeSlot The time slot for the reminder.
 * @returns Array of valid delays in milliseconds.
 */
export function calculateReminderDelays(timeSlot: Moment): ReminderDetails[] {
  // console.log(moment(timeSlot).)
  const reminders: ReminderDetails[] = [];
  const now = moment(); // Current time

  const delay2MinutesBeforeTimeSlot = moment(timeSlot)
    .subtract(2, 'minutes')
    .diff(now);
  const delay15MinutesBeforeTimeSlot = moment(timeSlot)
    .subtract(15, 'minutes')
    .diff(now);

  const delay1DayBeforeTimeSlot = moment(timeSlot)
    .subtract(1, 'days')
    .diff(now);

  if (delay2MinutesBeforeTimeSlot > 0) {
    reminders.push({
      delayMs: delay2MinutesBeforeTimeSlot,
      message: '۲ دقیقه تا نوبت شما باقی مانده است',
    });
  }
  if (delay15MinutesBeforeTimeSlot > 0) {
    reminders.push({
      delayMs: delay15MinutesBeforeTimeSlot,
      message: '۱۵ دقیقه تا نوبت شما باقی مانده است',
    });
  }
  if (delay1DayBeforeTimeSlot > 0) {
    reminders.push({
      delayMs: delay1DayBeforeTimeSlot,

      message: '۱ روز تا نوبت شما باقی مانده است',
    });
  }

  return reminders;
}
