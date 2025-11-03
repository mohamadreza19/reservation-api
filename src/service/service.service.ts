import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

  constructor(
    @InjectRepository(Service)
    private readonly service: Repository<Service>,
  ) {}

  getAll() {
    return this.service.find();
  }

  findById(id: string) {
    return this.service.findOneBy({ id });
  }
}
