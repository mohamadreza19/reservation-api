import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessCategory } from './entities/business-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessCategoryService {
  constructor(
    @InjectRepository(BusinessCategory)
    private businessCategoryRepository: Repository<BusinessCategory>,
  ) {}

  async getAllBusinessCategory() {
    return await this.businessCategoryRepository.find();
  }

  async findOneById(id: number) {
    return await this.businessCategoryRepository.findOneBy({
      id,
    });
  }
}
