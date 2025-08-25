import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ServiceModule } from 'src/service/service.module';
import { BusinessModule } from 'src/business/business.module';
import { EmployeeRegister } from './entities/employee-register.entity';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, EmployeeRegister]),
    UserModule,
    ServiceModule,
    BusinessModule,
    NotificationModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
