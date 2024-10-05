import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from '../business/business.module';
import { CustomerModule } from '../customer/customer.module';
import { ServiceProfileModule } from '../service-profile/service-profile.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    CustomerModule,
    BusinessModule,
    ServiceProfileModule,
    TypeOrmModule.forFeature([Appointment]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
