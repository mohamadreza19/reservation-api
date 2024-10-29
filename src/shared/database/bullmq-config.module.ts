// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('REDIS_URL'));
        const redis = new Redis(configService.get('REDIS_URL'), {
          // tls: {
          //   rejectUnauthorized: false,
          // },
        });
        console.log(redis);
        return {
          name: 'jobs',
          maxConcurrent: 1,
          connection: redis,

          //   redis: {
          //     host: configService.get('REDIS_HOST'),
          //     port: configService.get('REDIS_PORT'),
          //   },
        };
      },
    }),
  ],
})
export class BullMQConfigModule {}
