import { Module } from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategoryController } from './service-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { BusinessCategoryModule } from '../business-category/business-category.module';
import { BusinessCategoryService } from '../business-category/business-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory]),
    BusinessCategoryModule,
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
