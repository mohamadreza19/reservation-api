// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'jobs',
        maxConcurrent: 1,
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),

          db: 0,
        },

        //   redis: {
        //     host: configService.get('REDIS_HOST'),
        //     port: configService.get('REDIS_PORT'),
        //   },
      }),
    }),
  ],
})
export class BullMQConfigModule {}
