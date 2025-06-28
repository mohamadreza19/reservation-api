import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { ServiceModule } from 'src/service/service.module';
import { BusinessModule } from 'src/business/business.module';

@Module({
  imports: [TypeOrmModule.forFeature([Price])],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
