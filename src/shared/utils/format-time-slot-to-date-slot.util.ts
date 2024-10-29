import moment from 'moment';
/**
 * Formats the given date and time into an ISO 8601 date-time string.
 *
 * @param {string} date - The date in "YYYY-MM-DD" format. Example: "2024-10-13".
 * @param {string} HHMM - The time in "HHMM" format (24-hour format). Example: "1230" for 12:30 PM.
 * @returns {object} - moment object.
 */
export function formatTimeSlotToDate(
  date: string,
  HHMM: string,
): moment.Moment {
  const dateTimeString = `${date} ${HHMM}`;
  const dateforamt = moment(dateTimeString, 'YYYY-MM-DD HH:mm');
  return dateforamt;
}
