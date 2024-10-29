// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConnection = new Redis({
          // Use Render Redis service name as host, red-xxxxxxxxxxxxxxxxxxxx
          host: configService.get('REDIS_SERVICE_NAME'),
          // Default Redis port
          port: configService.get('REDIS_PORT') || 6379,
        });

        return {
          name: 'jobs',
          maxConcurrent: 1,
          connection: redisConnection,

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
