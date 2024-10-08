import { Injectable } from '@nestjs/common';
import moment from 'moment-jalaali';
// import fa from 'moment/src/fa';
import { CustomJalaliDate } from 'src/shared/types/custom-jalali-date.interface';
import { JalaliWeek } from 'src/shared/types/jalali-week.enum';
import {
  AvailableHour,
  TimeSlots,
  WeeklyTimeSlots,
} from 'src/shared/types/time-slots.interface';
import { BusinessSchedule } from '../business/business-schedule/entities/business-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {
    // moment.locale('fa', fa);
    // moment.loadPersian();
  }
  generateTimeSlots(
    schedule: BusinessSchedule,

    date: Date,
  ): string[] {
    const { startHour, endHour, timeInterval, holidays } = schedule;

    // 1. بررسی اینکه آیا روز انتخاب‌شده تعطیل است یا خیر
    const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday
    if (holidays.includes(dayOfWeek)) {
      return []; // روز تعطیل است، هیچ بازه زمانی وجود ندارد
    }

    // 2. تبدیل ساعت‌های شروع و پایان به زمان قابل محاسبه
    const startTime = moment(startHour, 'HH:mm');
    const endTime = moment(endHour, 'HH:mm');

    // 3. محاسبه بازه‌های زمانی
    const timeSlots: string[] = [];
    let currentTime = startTime.clone();

    while (currentTime.isBefore(endTime)) {
      const slot = currentTime.format('HH:mm');
      timeSlots.push(slot);
      currentTime.add(timeInterval, 'minutes'); // افزودن فاصله زمانی به زمان کنونی
    }

    return timeSlots;
  }
  async generateJalalianWeeklyTimeSlots(
    schedule: BusinessSchedule,
    businessId: number,
    date: Date,
  ) {
    // : Promise<TimeSlots>
    // Destructure the business schedule object to get relevant data
    const { startHour, endHour, timeInterval, holidays } = schedule;

    // Initialize the weekly time slots object to store available time slots for each day
    const weeklyTimeSlots: WeeklyTimeSlots = {};

    // Find the start and end of the week in the Jalali calendar for the given date
    const [startDayOfWeek, endDayOfWeek] =
      this.findStartDayAndEndDayOfJalaliWeek(date);

    // const preWeek = startDayOfWeek.date
    //   .clone()
    //   .subtract(7, 'day')
    //   .format('YYYY-MM-DD');
    // const nextWeek = endDayOfWeek.date
    //   .clone()
    //   .add(1, 'days')
    //   .format('YYYY-MM-DD');

    // Convert the working hours to moment objects for easier manipulation
    const startTime = moment(startHour, 'HH:mm');
    const endTime = moment(endHour, 'HH:mm');
    const currentDate = moment();

    // const yesterday = moment().subtract(1, 'day');
    let slots: any[] = [];
    // Loop through each day of the week starting from startDayOfWeek to endDayOfWeek
    for (
      let dayOfWeek = startDayOfWeek.isoWeekday;
      dayOfWeek <= endDayOfWeek.isoWeekday;
      dayOfWeek++
    ) {
      // Check if the current day is a holiday
      // (Currently, it's set to generate slots for all days due to)

      // Initialize an empty array to hold time slots for the current day

      let startTimeSlot = startTime.clone(); // Start from the opening time

      // Generate time slots by adding timeInterval repeatedly until reaching the closing time
      while (startTimeSlot.isBefore(endTime)) {
        // Format the current time slot in 'HH:mm' format
        const slot = startTimeSlot.format('HH:mm');
        let isStartDayOfWeekAfterDate: boolean = true;

        console.log('startDayOfWeek', startDayOfWeek);

        startDayOfWeek.date.isSameOrAfter(currentDate)
          ? (isStartDayOfWeekAfterDate = true)
          : (isStartDayOfWeekAfterDate = false);

        // Add the time slot with availability set t`o true (means available)
        // if (!holidays.includes(dayOfWeek)) {
        //   slots.push([slot, true]);
        // } else {
        //   slots.push([slot, false]);
        // }

        const timeSlot = this.timeSlotRepository.create({
          HHMM: slot,
          date: startDayOfWeek.date.clone().format('YYYY-MM-DD'),
          business: { id: businessId },
          available: !holidays.includes(dayOfWeek) && isStartDayOfWeekAfterDate, // Assume all slots are available for now
        });
        slots.push(timeSlot);
        // Move to the next time slot by adding the time interval (in minutes)
        startTimeSlot.add(timeInterval, 'minutes');
      }

      // Store the time slots for the current day in the weeklyTimeSlots object
      // weeklyTimeSlots[startDayOfWeek.date.format('YYYY-MM-DD')] = slots;

      // Move to the next day by adding one day to the startDayOfWeek date
      startDayOfWeek.date.add(1, 'day');

      if (dayOfWeek === endDayOfWeek.isoWeekday) {
        this.timeSlotRepository.save(slots);
        // console.log(slots);
      }
    }

    // Return the weekly time slots object containing all available time slots for the week

    // return {
    //   preWeek,
    //   nextWeek,
    //   weeklyTimeSlots,
    // };
  }
  async getTimeSlotWeekly(businessId: number, date: Date): Promise<any> {
    const [startDayOfWeek, endDayOfWeek] =
      this.findStartDayAndEndDayOfJalaliWeek(date);

    const timeSlots = await this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      // .select(['timeSlot.date', 'timeSlot.HHMM', 'timeSlot.available']) // Select fields without aggregation
      .where('timeSlot.businessId = :businessId', { businessId })
      .andWhere('timeSlot.date BETWEEN :startDate AND :endDate', {
        startDate: startDayOfWeek.date.format('YYYY-MM-DD'),
        endDate: endDayOfWeek.date.format('YYYY-MM-DD'),
      })
      .getMany(); // Get results without aggregation

    return timeSlots; // Return the formatted results
  }

  generateGregorianWeeklyTimeSlots(
    schedule: BusinessSchedule,
    date: Date,
  ): WeeklyTimeSlots {
    const { startHour, endHour, timeInterval, holidays } = schedule;

    // Convert hours to moment objects
    const startTime = moment(startHour, 'HH:mm');
    const endTime = moment(endHour, 'HH:mm');

    // Create an object to hold time slots for each day of the week
    const weeklyTimeSlots: WeeklyTimeSlots = {};

    // Set the current day to the start of the week (Monday)
    let currentDay = moment(date, 'YYYY-MM-DD')
      .startOf('isoWeek')
      .day(7)
      .add(1, 'weeks');

    const endDay = currentDay.clone().add(7, 'days'); // Get the end of the week (Sunday)

    // Loop through each day of the week
    while (currentDay.isBefore(endDay)) {
      const dayOfWeek = currentDay.isoWeekday(); // Get the day of the week (1-7, Monday-Sunday)
      // console.log(dayOfWeek);
      // Check if the current day is a holiday
      if (!holidays.includes(dayOfWeek) || true) {
        let slots: AvailableHour[] = [];
        let currentSlotTime = startTime.clone();

        // Generate time slots for the day
        while (currentSlotTime.isBefore(endTime)) {
          const slot = currentSlotTime.format('HH:mm');
          slots.push([slot, true]);
          currentSlotTime.add(timeInterval, 'minutes');
        }

        // Store the time slots for the current day
        weeklyTimeSlots[currentDay.format('YYYY-MM-DD')] = slots;
      }

      // Move to the next day
      currentDay.add(1, 'day');
    }

    return weeklyTimeSlots;
  }

  private reindexedDayOfWeek = (day: number) => {
    if (day === 6) {
      return 1; // Saturday becomes day 1
    } else if (day === 7) {
      return 2; // Sunday becomes day 2
    } else {
      return day + 2; // Monday (1) becomes day 3, Tuesday (2) becomes day 4, etc.
    }
  };
  private findStartDayAndEndDayOfJalaliWeek(
    date: Date,
  ): [CustomJalaliDate, CustomJalaliDate] {
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

    return [
      {
        date: startDayOfWeek.locale('en'),
        isoWeekday: 0,
      },
      {
        date: endDayOfWeek.locale('en'),
        isoWeekday: 6,
      },
    ];
  }
}
