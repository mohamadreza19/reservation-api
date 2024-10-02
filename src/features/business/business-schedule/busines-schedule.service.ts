import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessScheduleDto } from './dto/create-business-schedule.dto';
import { UpdateBusinessScheduleDto } from './dto/update-business-schedule.dto';
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
      startTime: '09:00',
      endTime: '17:00',
      timeInterval: 30,
    });
  }

  async updateBusinessSchedule(
    updateBusinessScheduleDto: UpdateBusinessScheduleDto,
    businessId: number,
  ) {
    // Update BusinessSchedule where the Business is associated with it
    const schedule = await this.businessScheduleRepository
      .createQueryBuilder('businessSchedule')
      .select('businessSchedule.id')
      .innerJoin('businessSchedule.business', 'business')
      .where('business.id = :businessId', { businessId })
      .getOne();

    if (!schedule) {
      throw new NotFoundException('BusinessSchedule not found');
    }

    // Now update the BusinessSchedule by its ID
    await this.businessScheduleRepository
      .createQueryBuilder()
      .update(BusinessSchedule)
      .set(updateBusinessScheduleDto)
      .where('id = :id', { id: schedule.id })
      .execute();
  }
}
