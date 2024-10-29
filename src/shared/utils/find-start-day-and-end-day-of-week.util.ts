import moment, { Moment } from 'moment-jalaali';

import { JalaliWeek } from '../types/jalali-week.enum';

type StartDayOfWeek = Moment;
type EndDayOfWeek = Moment;
export function findStartDayAndEndDayOfJalaaliWeek(
  date: Moment,
): [StartDayOfWeek, EndDayOfWeek] {
  const momentD = moment(date).locale('fa');
  const stringDayName = momentD.format('dddd');

  let startDayOfWeek: moment.Moment;
  let endDayOfWeek: moment.Moment;

  switch (stringDayName) {
    case JalaliWeek.Saturday:
      startDayOfWeek = momentD.clone();
      endDayOfWeek = momentD.clone().add(6, 'days');
      break;
    case JalaliWeek.Sunday:
      startDayOfWeek = momentD.clone().subtract(1, 'day');
      endDayOfWeek = momentD.clone().add(5, 'days');
      break;
    case JalaliWeek.Monday:
      startDayOfWeek = momentD.clone().subtract(2, 'day');
      endDayOfWeek = momentD.clone().add(4, 'days');
      break;
    case JalaliWeek.Tuesday:
      startDayOfWeek = momentD.clone().subtract(3, 'day');
      endDayOfWeek = momentD.clone().add(3, 'days');
      break;
    case JalaliWeek.Wednesday:
      startDayOfWeek = momentD.clone().subtract(4, 'day');
      endDayOfWeek = momentD.clone().add(2, 'days');
      break;
    case JalaliWeek.Thursday:
      startDayOfWeek = momentD.clone().subtract(5, 'day');
      endDayOfWeek = momentD.clone().add(1, 'days');
      break;
    case JalaliWeek.Friday:
      startDayOfWeek = momentD.clone().subtract(6, 'day');
      endDayOfWeek = momentD.clone();
      break;
  }

  return [startDayOfWeek.locale('en'), endDayOfWeek.locale('en')];
}
