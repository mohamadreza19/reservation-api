import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { CustomerModule } from '../customer/customer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BusinessModule } from '../business/business.module';
import { EmployeeModule } from '../employee/employee.module';

import { ServiceProfileModule } from '../service-profile/service-profile.module';

import { ConfigModule } from '@nestjs/config';
import { CacheManagerModule } from '../../shared/cache-manager/cache-manager.module';
import { TransactionModule } from '../transaction/transaction.module';

import { CustomJwtModule } from '../../shared/jwt/customJwt.module';

import { AppointmentModule } from '../appointment/appointment.module';
import { BusinessCategoryModule } from '../business-category/business-category.module';
import { ServiceCategoryModule } from '../service-category/service-category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TimeSlotsModule } from '../time-slots/time-slots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheManagerModule,
    DatabaseModule,
    CustomJwtModule,
    //
    CustomerModule,
    TransactionModule,

    EmployeeModule,
    ServiceProfileModule,

    BusinessModule,
    TimeSlotsModule,

    BusinessCategoryModule,
    ServiceCategoryModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
