import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { ServiceModule } from 'src/service/service.module';
import { BusinessModule } from 'src/business/business.module';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), ServiceModule, BusinessModule],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
