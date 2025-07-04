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
  1: 'شنبه', // شنبه
  2: 'یک‌شنبه', // یک‌شنبه
  3: 'دوشنبه', // دوشنبه
  4: 'سه‌شنبه', // سه‌شنبه
  5: 'چهارشنبه', // چهارشنبه
  6: 'پنج‌شنبه', // پنج‌شنبه
  7: 'آدینه', // آدینه
};

export function DayValues(): number[] {
  return Object.values(Day).filter((v) => typeof v === 'number') as number[];
}
