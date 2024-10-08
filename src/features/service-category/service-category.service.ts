import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessCategoryService } from '../business-category/business-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategory } from './entities/service-category.entity';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
    private readonly businessCategoryService: BusinessCategoryService,
  ) {}
  async create(createServiceCategoryDto: CreateServiceCategoryDto) {
    const businessCategory = await this.businessCategoryService.findOneById(
      createServiceCategoryDto.businessCategoryId,
    );

    if (!businessCategory) {
      throw new BadRequestException('Business Category Not Found');
    }
    const serviceCategoryInstance = this.serviceCategoryRepository.create({
      name: createServiceCategoryDto.name,
      businessCategory,
    });

    return await this.serviceCategoryRepository.save(serviceCategoryInstance);
  }

  async findAll() {
    return await this.serviceCategoryRepository.find();
  }
  async findAllByBusinessCategoryId(businessCategoryId: number) {
    return await this.serviceCategoryRepository.find({
      where: { businessCategory: { id: businessCategoryId } }, // فیلتر بر اساس businessCategoryId
      // relations: ['businessCategory'], // برای دریافت داده‌های مرتبط
    });
  }

  async findOneById(id: number) {
    return await this.serviceCategoryRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    return `This action updates a #${id} serviceCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceCategory`;
  }
}
