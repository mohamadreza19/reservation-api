import { forwardRef, Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { BusinessModule } from 'src/business/business.module';

import { PriceModule } from 'src/price/price.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), BusinessModule, PriceModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
