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
        const redisUrl = configService.get('REDIS_URL');

        if (!redisUrl) {
          throw new Error('REDIS_URL is not defined');
        }
        const redis = new Redis(redisUrl);

        return {
          name: 'jobs',

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
