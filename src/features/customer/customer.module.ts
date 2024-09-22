import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [TransactionModule, TypeOrmModule.forFeature([Customer])],
})
export class CustomerModule {}
