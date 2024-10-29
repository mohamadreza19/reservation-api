import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { TimeSlotsService } from './time-slots.service';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    forwardRef(() => AppointmentModule),
    TypeOrmModule.forFeature([TimeSlot]),
  ],
  providers: [TimeSlotsService],

  exports: [TimeSlotsService],
})
export class TimeSlotsModule {}
