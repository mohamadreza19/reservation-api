import { Injectable } from '@nestjs/common';
import { CreateBusinessScheduleDto } from './dto/create-business-schedule.dto';
import { UpdateBusinessScheduleDto } from './dto/update-business-schedule.dto';
import { BusinessService } from '../business/business.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessSchedule } from './entities/business-schedule.entity';
import { UserPayload } from 'src/shared/types/user-payload.interface';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessScheduleService {
  constructor(
    @InjectRepository(BusinessSchedule)
    private readonly businessScheduleRepository: Repository<BusinessSchedule>,
    private readonly businessService: BusinessService,
  ) {}
  async create(
    createBusinessScheduleDto: CreateBusinessScheduleDto,
    user: UserPayload,
  ) {
    const businessScheduleInstance = this.businessScheduleRepository.create({
      ...createBusinessScheduleDto,
      business: {
        id: user.userId,
      },
    });
    console.log(businessScheduleInstance);
    return await this.businessScheduleRepository.save(businessScheduleInstance);
  }

  findAll() {
    return `This action returns all businessSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessSchedule`;
  }

  update(id: number, updateBusinessScheduleDto: UpdateBusinessScheduleDto) {
    return `This action updates a #${id} businessSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessSchedule`;
  }
}
