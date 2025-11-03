import { Controller, Get } from '@nestjs/common';
import { ServiceService } from './service.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Get()
  findAll() {
    return this.service.getAll();
  }
}
