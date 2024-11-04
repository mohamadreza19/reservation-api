import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from '../business/business.module';
import { CustomerModule } from '../customer/customer.module';
import { ServiceProfileModule } from '../service-profile/service-profile.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { BullModule } from '@nestjs/bullmq';

import { TestController } from './test.controller';

import { NotificationQueueModule } from 'src/shared/queues/notification-queue/notification-queue.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { AppointmentActionModuleModule } from './appointment-action-module/appointment-action-module.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    forwardRef(() => BusinessModule),

    ServiceProfileModule,
    TypeOrmModule.forFeature([Appointment]),

    NotificationQueueModule,

    AppointmentActionModuleModule,
    TransactionModule,
  ],
  controllers: [AppointmentController, TestController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
