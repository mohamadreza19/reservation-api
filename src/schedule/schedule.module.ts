import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { BusinessModule } from 'src/business/business.module';
import { UserModule } from 'src/user/user.module';
import { TimeslotModule } from 'src/time-slot/time-slot.module';
import { ScheduleValidationService } from './services/schedule-validation.service';
import { ScheduleUpdaterService } from './services/schedule-updater.service';
import { ScheduleTimeslotService } from './services/schedule-timeslot.service';
import { ScheduleFactoryService } from './services/schedule-factory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    BusinessModule,
    UserModule,
    forwardRef(() => TimeslotModule),
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleValidationService,
    ScheduleUpdaterService,
    ScheduleTimeslotService,
    ScheduleFactoryService,
  ],
  exports: [ScheduleService],
})
export class ScheduleModule {}
