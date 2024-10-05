// YYYY-MM-DD
type WeekDay = string;

type IsAvailable = boolean;

// HH:mm
type Hour = string;

export type AvailableHour = [Hour?, IsAvailable?];

export interface WeeklyTimeSlots {
  [key: WeekDay]: AvailableHour[];
}
type DateString = string; // YYYY-MM-DD
export interface TimeSlots {
  weeklyTimeSlots: WeeklyTimeSlots;
  preWeek: DateString;
  nextWeek: DateString;
}
