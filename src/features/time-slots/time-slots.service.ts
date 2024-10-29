import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment, { Moment } from 'moment-jalaali';
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
import { TimeSlotStatus } from 'src/shared/types/time-slot-status.enum';
import { AppointmentService } from '../appointment/appointment.service';
import { findJalaaliDayNumber } from 'src/shared/utils';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
  ) {
    // moment.locale('fa', fa);
    // moment.loadPersian();
  }

  async createWeeklyTimeSlots(
    schedule: BusinessSchedule,
    businessId: number,
    startDayOfWeek: Moment, // Passing startDayOfWeek as an argument
    endDayOfWeek: Moment, // Passing endDayOfWeek as an argument
    excludedDates: string[], // Array of dates to exclude (YYYY-MM-DD format)
  ) {
    // Destructure the business schedule object to get relevant data
    const { startHour, endHour, timeInterval, holidays } = schedule;

    // Convert the working hours to moment objects for easier manipulation
    const startTime = moment(startHour, 'HH:mm');
    const endTime = moment(endHour, 'HH:mm');

    let slots: any[] = [];

    // Use a while loop to iterate from startDayOfWeek to endDayOfWeek
    while (startDayOfWeek.isSameOrBefore(endDayOfWeek, 'day')) {
      const currentDay = startDayOfWeek.clone(); // Clone the current day to work with it
      const currentDayNumber = findJalaaliDayNumber(currentDay); // Get the Jalali day number
      // Format currentDay as 'YYYY-MM-DD' to check against excludedDates
      const currentDayFormatted = currentDay.format('YYYY-MM-DD');

      // Skip the day if it's in the excludedDates array
      if (excludedDates.includes(currentDayFormatted)) {
        console.log(
          `Skipping date: ${currentDayFormatted} as it's in the excludedDates`,
        );
        startDayOfWeek.add(1, 'day'); // Move to the next day
        continue;
      }

      let startTimeSlot = startTime.clone(); // Start from the opening time

      // Generate time slots by adding timeInterval repeatedly until reaching the closing time
      while (startTimeSlot.isBefore(endTime)) {
        // Format the current time slot in 'HH:mm' format
        const slot = startTimeSlot.format('HH:mm');
        let status = TimeSlotStatus.AVAILABLE;

        // Mark the day unavailable if it's a holiday
        if (holidays.includes(currentDayNumber)) {
          status = TimeSlotStatus.UNAVAILABLE;
        }

        const timeSlot = this.timeSlotRepository.create({
          HHMM: slot,
          date: currentDayFormatted, // Assign the formatted current day as the date
          business: { id: businessId },
          status: status, // Set the status of the time slot (available/unavailable)
        });

        slots.push(timeSlot); // Add the time slot to the array

        // Move to the next time slot by adding the time interval (in minutes)
        startTimeSlot.add(timeInterval, 'minutes');
      }

      // Move to the next day
      startDayOfWeek.add(1, 'day');
    }

    // Save all the generated time slots to the database at the end of the loop
    await this.timeSlotRepository.save(slots);
    // console.log('Time slots for the week have been saved:', slots);
  }

  async getTimeSlotWeekly(businessId: number, date: Date): Promise<any> {
    const [startDayOfWeek, endDayOfWeek] =
      this.findStartDayAndEndDayOfJalaliWeek(date);

    const currentDate = moment();
    // const HHMM = moment().format('HH:mm');
    const format = 'YYYY-MM-DD';

    const timeSlots = await this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .where('timeSlot.businessId = :businessId', { businessId })
      .andWhere('timeSlot.date BETWEEN :startDate AND :endDate', {
        startDate: startDayOfWeek.date.isBefore(currentDate)
          ? currentDate.format(format)
          : startDayOfWeek.date.format(format),
        endDate: endDayOfWeek.date.isAfter(currentDate)
          ? endDayOfWeek.date.format(format)
          : currentDate.format(format),
      })
      // .andWhere('timeSlot.HHMM > :HHMM', { HHMM: HHMM })
      .orderBy('timeSlot.date', 'ASC')
      .getMany(); // Get results without aggregation

    return timeSlots; // Return the formatted results
  }
  async getTimeSlots(businessId: number, since: Moment) {
    return this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .where('timeSlot.businessId = :businessId', { businessId })

      .andWhere('timeSlot.date > :since', { since: since.toISOString() })
      .orderBy('timeSlot.date', 'ASC')
      .getMany(); // Get results without aggregation
  }
  async getLastTimeSlot() {
    return await this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .orderBy('timeSlot.date', 'DESC') // Order by id in descending order (most recent first)
      .take(1) // Limit to 1 result (the last one)
      .getOne(); // Fetch the single last result
  }
  async findOneById(timeSlotId: number) {
    return await this.timeSlotRepository.findOne({
      where: { id: timeSlotId },
    });
  }

  async updateHolidays(businessId: number, holidays: number[]) {
    // Get the date for "one day before today" using Moment.js
    const aDayBefore = moment().subtract(1, 'days');

    // Fetch all time slots for the specified business that are after "aDayBefore"
    const timeSlots = await this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .where('timeSlot.businessId = :businessId', { businessId }) // Filter by businessId
      .andWhere('timeSlot.date > :date', { date: aDayBefore }) // Filter for future time slots (after the previous day)
      .getMany(); // Execute the query and get the results

    // Iterate over each fetched time slot asynchronously
    timeSlots.forEach(async (timeSlot) => {
      // Format the time slot's date using Moment.js in 'YYYY-MM-DD' format
      const dateFormat = moment(timeSlot.date, 'YYYY-MM-DD');

      // Get the day number in the Jalali calendar (Persian calendar) for the time slot's date
      const numberOfDay = this.getJalaliNumberOfDay(dateFormat);

      // Check if the current day number matches any of the provided holiday day numbers
      if (holidays.includes(numberOfDay)) {
        // If the time slot's status is not 'BOOKED', set it to 'UNAVAILABLE' (since it's a holiday)
        if (timeSlot.status !== TimeSlotStatus.BOOKED) {
          timeSlot.status = TimeSlotStatus.UNAVAILABLE;
        }
      } else if (timeSlot.status === TimeSlotStatus.UNAVAILABLE) {
        // If the current day is not a holiday and the time slot is marked 'UNAVAILABLE', revert it back to 'AVAILABLE'
        timeSlot.status = TimeSlotStatus.AVAILABLE;
      }
      console.log(timeSlot);
      this.timeSlotRepository.save(timeSlot);
    });
  }
  async updateTimeInterval(schedule: BusinessSchedule, businessId: number) {
    const currentDate = moment();

    const appointments =
      await this.appointmentService.findTimeSlotsByAppointment(
        businessId,
        currentDate,
      );

    // Extract all timeSlot dates from appointments
    const bookedDates = appointments.map((app) => app.timeSlot.date);

    const timeSlotsToDelete = await this.getTimeSlots(businessId, currentDate);

    const lastTimeSlot =
      timeSlotsToDelete.length > 0
        ? timeSlotsToDelete[timeSlotsToDelete.length - 1]
        : null;
    if (!lastTimeSlot) {
      throw new Error('last time slot not found');
    }

    for (const timeSlot of timeSlotsToDelete) {
      // If this time slot's date is not in the bookedDates (i.e., not linked to an appointment)
      if (!bookedDates.includes(timeSlot.date)) {
        await this.timeSlotRepository.delete(timeSlot.id);
      }
    }
    const lastTimeSlotToMomentDate = moment(lastTimeSlot.date, 'YYYY-MM-DD');

    await this.createWeeklyTimeSlots(
      schedule,
      businessId,
      currentDate,
      lastTimeSlotToMomentDate,
      bookedDates,
    );

    // for (let index = 0; index < timeSlots.length; index++) {
    //   const timeSlot = timeSlots[index];
    //   console.log(BookDates);
    //   if (index === 0) {
    //     dateStart = timeSlot.date;
    //   }
    //   if (index === timeSlots.length - 1) {
    //     dateEnd = timeSlot.date;
    //   }

    //   const appointment = await this.appointmentService.findOneByTimeSlotId(
    //     timeSlot.id,
    //   );

    //   if (appointment) {
    //     if (!bookedTimeSlotDate) {
    //       bookedTimeSlotDate = timeSlot.date;
    //       BookDates.push(bookedTimeSlotDate);
    //       console.log('biv');
    //     }
    //     if (bookedTimeSlotDate !== timeSlot.date) {
    //       bookedTimeSlotDate = timeSlot.date;
    //       BookDates.push(bookedTimeSlotDate);
    //     }
    //   }
    // }
  }
  async updateTimeSlotStatusById(timeSlot: TimeSlot, status: TimeSlotStatus) {
    timeSlot.status = status;
    this.timeSlotRepository.save(timeSlot);
  }
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

  private getJalaliNumberOfDay(date: Moment): number {
    const momentD = date.locale('fa');
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
}
