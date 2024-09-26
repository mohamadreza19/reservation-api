import { Module } from '@nestjs/common';
import { BusinessCategoryService } from './business-category.service';
import { BusinessCategoryController } from './business-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessCategory } from './entities/business-category.entity';
import { ServiceCategory } from './entities/service-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessCategory, ServiceCategory])],
  providers: [BusinessCategoryService],
  controllers: [BusinessCategoryController],
})
export class BusinessCategoryModule {}
