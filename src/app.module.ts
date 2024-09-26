import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { CustomerModule } from './features/customer/customer.module';

import { BusinessModule } from './features/business/business.module';
import { EmployeeModule } from './features/employee/employee.module';

import { ServiceProfileModule } from './features/service-profile/service-profile.module';

import { RedisModule } from 'nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheManagerModule } from './shared/cache-manager/cache-manager.module';
import { TransactionModule } from './features/transaction/transaction.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtModule } from './shared/jwt/customJwt.module';

import { BusinessCategoryModule } from './features/business-category/business-category.module';

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
    BusinessModule,
    BusinessCategoryModule,

    EmployeeModule,
    ServiceProfileModule,
    BusinessCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
