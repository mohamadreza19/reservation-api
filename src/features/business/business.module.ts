import { forwardRef, Global, Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { AuthService } from 'src/shared/services/auth.service';
import { BusinessCategoryModule } from '../business-category/business-category.module';
import { CustomerModule } from '../customer/customer.module';
import { BusinesScheduleService } from './business-schedule/busines-schedule.service';
import { BusinessScheduleController } from './business-schedule/business-schedule.controller';
import { BusinessSchedule } from './business-schedule/entities/business-schedule.entity';
import { Business } from './entities/business.entity';
import { TimeSlotsController } from './time-slots/time-slots.controller';
import { TimeSlotsService } from './time-slots/time-slots.service';

@Global()
@Module({
  controllers: [
    BusinessController,
    BusinessScheduleController,
    TimeSlotsController,
  ],
  providers: [
    BusinessService,
    BusinesScheduleService,
    TimeSlotsService,
    AuthService,
  ],
  imports: [
    CacheManagerModule,
    TypeOrmModule.forFeature([Business, BusinessSchedule]),
    BusinessCategoryModule,
    forwardRef(() => CustomerModule),
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
