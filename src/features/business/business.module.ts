import { Global, Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';

import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { AuthService } from 'src/shared/services/auth.service';
import { BusinessCategoryModule } from '../business-category/business-category.module';
import { CustomerModule } from '../customer/customer.module';

@Global()
@Module({
  controllers: [BusinessController],
  providers: [BusinessService, AuthService],
  imports: [
    CacheManagerModule,
    TypeOrmModule.forFeature([Business]),
    BusinessCategoryModule,
    CustomerModule,
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
