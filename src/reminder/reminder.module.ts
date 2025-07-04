import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';

import { BullModule } from '@nestjs/bull';
import { ReminderProcessor } from './reminder.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointment/entities/appointment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),

    BullModule.registerQueueAsync({
      name: 'reminder',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        return {
          redis: redisUrl,
        };
      },
    }),
  ],

  providers: [ReminderService, ReminderProcessor],
  exports: [ReminderService],
})
export class ReminderModule {}
