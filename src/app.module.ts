import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomerModule } from './customer/customer.module';
import { BusinessModule } from './business/business.module';
import { AppointmentModule } from './appointment/appointment.module';

import { ServiceModule } from './service/service.module';
import { ReminderModule } from './reminder/reminder.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PriceModule } from './price/price.module';
import { ScheduleModule } from './schedule/schedule.module';

import { RedisModule } from './redis/redis.module';
import { TimeslotModule } from './time-slot/time-slot.module';
import { SwaggerModule } from './swagger/swagger.module';
import { FileModule } from './file/file.module';
import { BullModule } from '@nestjs/bull';

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
    // RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
