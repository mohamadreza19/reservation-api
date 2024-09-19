import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [TransactionModule],
})
export class CustomerModule {}
