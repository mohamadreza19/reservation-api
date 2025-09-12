import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  Matches,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Day } from 'src/common/enums/day.enum';
import { Schedule } from '../entities/schedule.entity';
import { Business } from 'src/business/entities/business.entity';
import { Service } from 'src/service/entities/service.entity';

export class ScheduleDto {
  @ApiProperty({
    description: 'Day of the week or holiday',
    enum: Day,
    example: Day.MONDAY,
  })
  @IsEnum(Day)
  day: Day;

  @ApiProperty({
    description: 'Start time in HH:mm:ss format (e.g., 09:00:00)',
    example: '09:00:00',
  })
  @IsString()
  workStart: string; // now required

  @ApiProperty({
    description: 'End time in HH:mm:ss format (e.g., 17:00:00)',
    example: '17:00:00',
  })
  @IsString()
  workEnd: string; // now required

  @ApiProperty({
    description: 'Whether the day is closed',
    example: false,
  })
  @IsBoolean()
  isOpen: boolean; // now required
}

export class CreateScheduleDto extends PartialType(ScheduleDto) {}

export class UpdateScheduleDto extends PartialType(ScheduleDto) {}

export class SyncFutureTimeslots {
  businessId: string;
  schedule: Schedule;
}

export class SyncFutureTimeslotContext {
  private schedule: Schedule;
  private services: Service[];
  private business: Business;

  private updateDto: UpdateScheduleDto;

  isOpenChange: boolean = false;
  isWorkStartChange: boolean = false;
  isWorkEndChange: boolean = false;

  constructor() {}

  addSchedule(schedule: Schedule) {
    this.schedule = schedule;
    return this;
  }

  addServices(services: Service[]) {
    this.services = services;
  }
  addUpdateDto(dto: UpdateScheduleDto) {
    this.updateDto = dto;
    this.computeChanges();
    return this;
  }
  addBusiness(business: Business) {
    this.business = business;
    return this;
  }
  applyChanges(schedule: Schedule) {
    const dto = this.getUpdateDto();
    if (dto.workStart) schedule.workStart = dto.workStart;
    if (dto.workEnd) schedule.workEnd = dto.workEnd;
    if (typeof dto.isOpen === 'boolean') schedule.isOpen = dto.isOpen;
  }
  applyUpdateDtoToSchedule() {
    if (!this.schedule) throw new Error('Schedule is not initialized');
    if (!this.updateDto) throw new Error('UpdateDto is not initialized');

    const dto = this.updateDto;
    const schedule = this.schedule;

    // loop over all keys in updateDto
    for (const key of Object.keys(dto) as (keyof UpdateScheduleDto)[]) {
      const value = dto[key];
      if (value !== undefined && key in schedule) {
        (schedule as any)[key] = value;
      }
    }
  }
  getBusiness() {
    if (!this.business) throw new Error('Business is not initialized');
    return this.business;
  }

  getSchedule() {
    if (!this.schedule) throw new Error('Schedule is not initiate');
    return this.schedule;
  }

  getServices() {
    if (!this.services) throw new Error('Services is not initiate');
    return this.services;
  }
  getUpdateDto() {
    if (!this.updateDto) throw new Error('UpdateDto is not initiate');
    return this.updateDto;
  }

  private computeChanges() {
    if (!this.schedule || !this.updateDto)
      throw new Error('!this.schedule || !this.updateDto');

    const { workStart, workEnd, isOpen } = this.updateDto;

    this.isOpenChange =
      typeof isOpen === 'boolean' && this.schedule.isOpen !== isOpen;

    this.isWorkStartChange =
      !!workStart && this.schedule.workStart !== workStart;

    this.isWorkEndChange = !!workEnd && this.schedule.workEnd !== workEnd;
  }
}
