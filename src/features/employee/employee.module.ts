import { forwardRef, Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';

import { BusinessModule } from '../business/business.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    forwardRef(() => BusinessModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
