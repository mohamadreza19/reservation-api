import { UpdateBusinessScheduleDto } from 'src/features/business/business-schedule/dto/update-business-schedule.dto';
import { BusinessSchedule } from 'src/features/business/business-schedule/entities/business-schedule.entity';
import _ from 'lodash';
import { BadRequestException } from '@nestjs/common';
export function getUpdatedBusinessScheduleFlags(
  updateBusinessScheduleDto: UpdateBusinessScheduleDto,
  businessSchedule: BusinessSchedule,
) {
  let isWorkingHourUpdated = false;
  let isTimeIntervalUpdated = false;
  let isHolidayUpdated = false;

  if (
    updateBusinessScheduleDto.startHour &&
    updateBusinessScheduleDto.endHour
  ) {
    const startHour = updateBusinessScheduleDto.startHour.split(':')[0];
    const endHour = updateBusinessScheduleDto.endHour.split(':')[0];
    // convert timeInterval to Hour for Check if between startHour and endHour is valid timeSlot

    const timeInterval = updateBusinessScheduleDto.timeInterval
      ? updateBusinessScheduleDto.timeInterval
      : businessSchedule.timeInterval;
    const timeIntervalInHour = timeInterval / 60;

    if (Number(endHour) < Number(startHour)) {
      throw new BadRequestException(
        'The start hour cannot be greater than the end hour.',
      );
    }
    if (Number(endHour) < Number(startHour) + timeIntervalInHour) {
      throw new BadRequestException(
        'The time interval between the start and end hour is not valid.',
      );
    }

    businessSchedule.startHour !== updateBusinessScheduleDto.startHour ||
    businessSchedule.endHour !== updateBusinessScheduleDto.endHour
      ? (isWorkingHourUpdated = true)
      : (isWorkingHourUpdated = false);
  }

  if (updateBusinessScheduleDto.holidays) {
    !_.isEqual(updateBusinessScheduleDto.holidays, businessSchedule.holidays)
      ? (isHolidayUpdated = true)
      : (isHolidayUpdated = false);
  }

  if (
    businessSchedule.timeInterval !== updateBusinessScheduleDto.timeInterval
  ) {
    isTimeIntervalUpdated = true;
  }

  return {
    isWorkingHourUpdated,
    isTimeIntervalUpdated,
    isHolidayUpdated,
  };
}
