import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';

import { BusinessModule } from '../business/business.module';
import { AuthModule } from 'src/shared/modules/auth/auth.module';

@Global()
@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    AuthModule,
    forwardRef(() => BusinessModule),
    CacheManagerModule,

    TypeOrmModule.forFeature([Customer]),
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
