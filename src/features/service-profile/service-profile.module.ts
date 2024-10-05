import { Module } from '@nestjs/common';
import { ServiceProfileController } from './service-profile.controller';
import { ServiceProfileService } from './service-profile.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from '../business/business.module';
import { EmployeeModule } from '../employee/employee.module';
import { ServiceCategoryModule } from '../service-category/service-category.module';
import { ServiceProfile } from './entities/service-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProfile]),
    //

    EmployeeModule,
    BusinessModule,
    ServiceCategoryModule,
  ],
  controllers: [ServiceProfileController],
  providers: [ServiceProfileService],
  exports: [ServiceProfileService],
})
export class ServiceProfileModule {}
