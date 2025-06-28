import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { BusinessModule } from 'src/business/business.module';
import { CustomerModule } from 'src/customer/customer.module';
import { ServiceModule } from 'src/service/service.module';
import { TimeslotModule } from 'src/time-slot/time-slot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),

    BusinessModule,
    CustomerModule,
    ServiceModule,
    TimeslotModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
