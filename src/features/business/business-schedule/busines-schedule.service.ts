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
}
