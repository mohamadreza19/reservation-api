import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { BusinessModule } from 'src/business/business.module';
import { UserModule } from 'src/user/user.module';
import { TimeslotModule } from 'src/time-slot/time-slot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    BusinessModule,
    UserModule,
    forwardRef(() => TimeslotModule),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
