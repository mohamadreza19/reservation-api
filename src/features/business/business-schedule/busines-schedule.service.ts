import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessScheduleDto } from './dto/create-business-schedule.dto';
import { BusinessSchedule } from './entities/business-schedule.entity';

@Injectable()
export class BusinesScheduleService {
  constructor(
    @InjectRepository(BusinessSchedule)
    private businessScheduleRepository: Repository<BusinessSchedule>,
  ) {}

  createInstance(createBusinessScheduleDto: CreateBusinessScheduleDto) {
    return this.businessScheduleRepository.create(createBusinessScheduleDto);
  }
  async createInitalInstance() {
    return this.businessScheduleRepository.create({
      holidays: [7],
      startHour: '09:00',
      endHour: '17:00',
      timeInterval: 30,
    });
  }
}
