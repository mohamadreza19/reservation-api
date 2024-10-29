// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      useFactory: (redisClient: RedisModuleOptions) => {
        console.log(redisClient);
        return {
          connection: redisClient,
        };
      },
      inject: ['REDIS_CLIENT'],
    }),
  ],
})
export class BullMQConfigModule {}
