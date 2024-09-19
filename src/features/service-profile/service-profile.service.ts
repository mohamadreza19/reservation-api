import { Injectable } from '@nestjs/common';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';

@Injectable()
export class ServiceProfileService {
  create(createServiceProfileDto: CreateServiceProfileDto) {
    return 'This action adds a new serviceProfile';
  }

  findAll() {
    return `This action returns all serviceProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceProfile`;
  }

  update(id: number, updateServiceProfileDto: UpdateServiceProfileDto) {
    return `This action updates a #${id} serviceProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceProfile`;
  }
}
