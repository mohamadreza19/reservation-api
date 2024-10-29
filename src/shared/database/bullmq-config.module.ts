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
        const port = configService.get('REDIS_PORT');
        const { REDIS_SERVICE_NAME, REDIS_PORT } = process.env;
        const renderRedis = new Redis({
          // Use Render Redis service name as host, red-xxxxxxxxxxxxxxxxxxxx
          username: REDIS_SERVICE_NAME,
          // Default Redis port
          port: Number(REDIS_PORT) || 6379,
        });

        return {
          name: 'jobs',

          connection: renderRedis,

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
