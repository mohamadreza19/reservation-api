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
        const redis = new Redis({
          host: configService.get('REDIS_SERVICE_NAME'), // Render Redis service name, red-xxxxxxxxxxxxxxxxxxxx
          port: port || 6379, // Redis port
        });

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
