import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder]), // <--- This registers the repository provider here
  ],
  controllers: [ReminderController],
  providers: [ReminderService],
})
export class ReminderModule {}
