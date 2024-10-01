import { Module } from '@nestjs/common';
import { BusinessScheduleService } from './business-schedule.service';
import { BusinessScheduleController } from './business-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessSchedule } from './entities/business-schedule.entity';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessSchedule]), BusinessModule],
  controllers: [BusinessScheduleController],
  providers: [BusinessScheduleService],
})
export class BusinessScheduleModule {}
