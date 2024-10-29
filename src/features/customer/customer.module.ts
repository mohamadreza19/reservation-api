import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';

import { AuthService } from 'src/shared/services/auth.service';
import { BusinessModule } from '../business/business.module';

@Global()
@Module({
  controllers: [CustomerController],
  providers: [CustomerService, AuthService],
  imports: [
    forwardRef(() => BusinessModule),
    CacheManagerModule,

    TypeOrmModule.forFeature([Customer]),
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
