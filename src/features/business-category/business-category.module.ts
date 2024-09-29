import { Module } from '@nestjs/common';
import { BusinessCategoryService } from './business-category.service';
import { BusinessCategoryController } from './business-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessCategory } from './entities/business-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessCategory])],
  providers: [BusinessCategoryService],
  controllers: [BusinessCategoryController],
  exports: [BusinessCategoryService],
})
export class BusinessCategoryModule {}
