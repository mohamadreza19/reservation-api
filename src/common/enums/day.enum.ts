export enum Day {
  SATURDAY = 1, // شنبه
  SUNDAY = 2, // یک‌شنبه
  MONDAY = 3, // دوشنبه
  TUESDAY = 4, // سه‌شنبه
  WEDNESDAY = 5, // چهارشنبه
  THURSDAY = 6, // پنج‌شنبه
  FRIDAY = 7, // جمعه
}

export const persianDayOrder = {
  1: 'saturday', // شنبه
  2: 'sunday', // یک‌شنبه
  3: 'monday', // دوشنبه
  4: 'tuesday', // سه‌شنبه
  5: 'wednesday', // چهارشنبه
  6: 'thursday', // پنج‌شنبه
  7: 'friday', // جمعه
};

export function DayValues(): number[] {
  return Object.values(Day).filter((v) => typeof v === 'number') as number[];
}
