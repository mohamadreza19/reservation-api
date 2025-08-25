import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeslotController } from './time-slot.controller';
import { TimeslotService } from './time-slot.service';
import { BusinessModule } from 'src/business/business.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

import { Timeslot } from './entities/time-slot.entity';
import { QueryService } from 'src/common/services/query.service';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timeslot]),
    BusinessModule,
    ScheduleModule,
    ServiceModule,
  ],
  providers: [TimeslotService],
  controllers: [TimeslotController],
  exports: [TimeslotService],
})
export class TimeslotModule {}
