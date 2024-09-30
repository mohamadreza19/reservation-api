import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { OtpService } from 'src/shared/cache-manager/otp.service';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { SharedAuthService } from 'src/shared/services/shared-auth.service';
import { BusinessCategoryModule } from '../business-category/business-category.module';
import { BusinessCategoryService } from '../business-category/business-category.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, SharedAuthService],
  imports: [
    CacheManagerModule,
    TypeOrmModule.forFeature([Business]),
    BusinessCategoryModule,
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
