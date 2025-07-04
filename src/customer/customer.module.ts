import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]), // <--- This registers the repository provider here
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
