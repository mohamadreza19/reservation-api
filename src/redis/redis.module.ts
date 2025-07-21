import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { URL } from 'url';

import { TimeslotRedisService } from './services/timeslot-redis.service';
import { ReminderRedisService } from './services/reminder-redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_TIMESLOT_CLIENT',
      useFactory: (configService: ConfigService) => {
        const parsed = new URL(configService.get('REDIS_URL')!);
        return new Redis();
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_REMINDER_CLIENT',
      useFactory: (configService: ConfigService) => {
        const parsed = new URL(configService.get('REDIS_URL')!);
        return new Redis({
          port: Number(parsed.port),
          host: parsed.hostname,
          username: parsed.username,
          password: parsed.password,
          db: 1,
          tls: { servername: parsed.hostname },
        });
      },
      inject: [ConfigService],
    },
    TimeslotRedisService,
    ReminderRedisService,
  ],
  exports: [
    'REDIS_TIMESLOT_CLIENT',
    'REDIS_REMINDER_CLIENT',
    TimeslotRedisService,
    ReminderRedisService,
  ],
})
export class RedisModule {}
