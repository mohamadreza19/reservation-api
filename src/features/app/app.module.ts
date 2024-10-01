import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../../shared/database/database.module';
import { CustomerModule } from '../customer/customer.module';

import { BusinessModule } from '../business/business.module';
import { EmployeeModule } from '../employee/employee.module';

import { ServiceProfileModule } from '../service-profile/service-profile.module';

import { ConfigModule } from '@nestjs/config';
import { CacheManagerModule } from '../../shared/cache-manager/cache-manager.module';
import { TransactionModule } from '../transaction/transaction.module';

import { CustomJwtModule } from '../../shared/jwt/customJwt.module';

import { BusinessCategoryModule } from '../business-category/business-category.module';
import { ServiceCategoryModule } from '../service-category/service-category.module';
import { BusinessScheduleModule } from '../business-schedule/business-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheManagerModule,
    DatabaseModule,
    CustomJwtModule,
    //
    CustomerModule,
    TransactionModule,

    EmployeeModule,
    ServiceProfileModule,

    BusinessModule,
    BusinessScheduleModule,

    BusinessCategoryModule,
    ServiceCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
