import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusinessModule } from 'src/business/business.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { TimeslotController } from './time-slot.controller';
import { TimeslotService } from './time-slot.service';

import { ServiceModule } from 'src/service/service.module';
import { Timeslot } from './entities/time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timeslot]),
    BusinessModule,
    forwardRef(() => ScheduleModule),

    forwardRef(() => ServiceModule),
  ],
  providers: [TimeslotService],
  controllers: [TimeslotController],
  exports: [TimeslotService],
})
export class TimeslotModule {}
