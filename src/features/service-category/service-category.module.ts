import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessCategoryModule } from '../business-category/business-category.module';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory]),
    BusinessCategoryModule,
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
