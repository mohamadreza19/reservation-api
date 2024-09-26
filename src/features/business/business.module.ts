import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { OtpService } from 'src/shared/cache-manager/otp.service';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, OtpService],
  imports: [CacheManagerModule, TypeOrmModule.forFeature([Business])],
})
export class BusinessModule {}
