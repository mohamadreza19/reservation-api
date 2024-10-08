import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlotsController } from './time-slots.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot])],
  providers: [TimeSlotsService],

  exports: [TimeSlotsService],
})
export class TimeSlotsModule {}
