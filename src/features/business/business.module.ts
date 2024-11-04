import { forwardRef, Global, Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';

import { BusinessCategoryModule } from '../business-category/business-category.module';
import { CustomerModule } from '../customer/customer.module';
import { BusinesScheduleService } from './business-schedule/busines-schedule.service';
import { BusinessScheduleController } from './business-schedule/business-schedule.controller';
import { BusinessSchedule } from './business-schedule/entities/business-schedule.entity';
import { Business } from './entities/business.entity';
import { TimeSlotsController } from '../time-slots/time-slots.controller';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { AuthModule } from 'src/shared/modules/auth/auth.module';

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
    // TimeSlotsService,
  ],
  imports: [
    AuthModule,
    CacheManagerModule,
    TypeOrmModule.forFeature([Business, BusinessSchedule]),
    BusinessCategoryModule,
    forwardRef(() => TimeSlotsModule),
    forwardRef(() => CustomerModule),
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
