// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import { redisClient } from './redis-db.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      useFactory: () => {
        return {
          connection: redisClient,
        };
      },
    }),
  ],
})
export class BullMQConfigModule {}
