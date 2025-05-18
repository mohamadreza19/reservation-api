import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomerModule } from './customer/customer.module';
import { BusinessModule } from './business/business.module';
import { AppointmentModule } from './appointment/appointment.module';
import { EmployeeModule } from './employee/employee.module';
import { ServiceModule } from './service/service.module';
import { ReminderModule } from './reminder/reminder.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // allows access to env vars throughout the app
    }),
    DatabaseModule,
    CustomerModule,
    BusinessModule,
    AppointmentModule,
    EmployeeModule,
    ServiceModule,
    ReminderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
