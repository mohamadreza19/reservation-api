import { Module } from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { ServiceProfileController } from './service-profile.controller';

import { AvailableTimeModule } from './available-time/available-time.module';
import { EmployeeModule } from '../employee/employee.module';
import { BusinessModule } from '../business/business.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProfile } from './entities/service-profile.entity';

@Module({
  controllers: [ServiceProfileController],
  providers: [ServiceProfileService],
  imports: [
    TypeOrmModule.forFeature([ServiceProfile]),
    //
    AvailableTimeModule,
    EmployeeModule,
    BusinessModule,
  ],
})
export class ServiceProfileModule {}
