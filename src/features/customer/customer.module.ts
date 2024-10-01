import { Global, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';

import { AuthService } from 'src/shared/services/auth.service';

@Global()
@Module({
  controllers: [CustomerController],
  providers: [CustomerService, AuthService],
  imports: [
    CacheManagerModule,
    TransactionModule,
    TypeOrmModule.forFeature([Customer]),
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
