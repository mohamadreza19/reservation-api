import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { OtpService } from 'src/shared/cache-manager/otp.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, OtpService],
  imports: [
    CacheManagerModule,
    TransactionModule,
    TypeOrmModule.forFeature([Customer]),
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
