import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { BusinessModule } from 'src/business/business.module';
import { FileModule } from 'src/file/file.module';
import { FileService } from 'src/file/file.service';
import { PriceModule } from 'src/price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    BusinessModule,
    FileModule.forRoot(),
    PriceModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService, FileService],
  exports: [ServiceService],
})
export class ServiceModule {}
