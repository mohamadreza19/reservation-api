import moment, { Moment } from 'moment-jalaali';

import { JalaliWeek } from '../types/jalali-week.enum';
export function findJalaaliDayNumber(date: Moment): number {
  const momentD = moment(date).locale('fa');
  const stringDayName = momentD.format('dddd');

  switch (stringDayName) {
    case JalaliWeek.Saturday:
      return 0;
    case JalaliWeek.Sunday:
      return 1;
    case JalaliWeek.Monday:
      return 2;
    case JalaliWeek.Tuesday:
      return 3;
    case JalaliWeek.Wednesday:
      return 4;
    case JalaliWeek.Thursday:
      return 5;
    case JalaliWeek.Friday:
      return 6;
  }
}
