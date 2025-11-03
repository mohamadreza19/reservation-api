import { Module } from '@nestjs/common';
import { BusinessServiceService } from './business-service.service';
import { BusinessServiceController } from './business-service.controller';
import { ServiceModule } from 'src/service/service.module';
import { BusinessModule } from 'src/business/business.module';
import { BusinessService as BsEntity } from './entities/business-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessServicePrice } from './entities/business-service-price.entity';
import { BusinessServicePriceController } from './business-service-price.controller';
import { BusinessServicePriceService } from './business-service-price.service';
@Module({
  imports: [
    ServiceModule,
    BusinessModule,
    TypeOrmModule.forFeature([BsEntity, BusinessServicePrice]),
  ],
  controllers: [BusinessServiceController, BusinessServicePriceController],
  providers: [BusinessServiceService, BusinessServicePriceService],
})
export class BusinessServiceModule {}
