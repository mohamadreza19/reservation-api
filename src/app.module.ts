import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { BusinessModule } from './business/business.module';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PriceModule } from './price/price.module';
import { ReminderModule } from './reminder/reminder.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';

import { BullModule } from '@nestjs/bull';
import { EmployeeModule } from './employee/employee.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FileModule } from './file/file.module';
import { SwaggerModule } from './swagger/swagger.module';
import { TimeslotModule } from './time-slot/time-slot.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // allows access to env vars throughout the app
      envFilePath: '.env',
    }),
    BullModule,
    DatabaseModule,
    CustomerModule,
    BusinessModule,
    AppointmentModule,
    // EmployeeModule,
    ServiceModule,
    ReminderModule,
    UserModule,
    AuthModule,
    PriceModule,
    ScheduleModule,
    TimeslotModule,
    SwaggerModule,

    FileModule,

    FeedbackModule,

    EmployeeModule,

    NotificationModule,

    // RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
