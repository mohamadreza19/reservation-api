// redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Global() // This makes the module global
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redis = new Redis({
          name: configService.get<string>('name'),
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'), // Optional
          password: configService.get<string>('REDIS_PASSWORD', ''), // Default to empty string
          db: configService.get<number>('REDIS_DB'),
        });

        // Optional: Handle connection errors
        redis.on('error', (err) => {
          console.error('Redis Client Error', err);
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'], // Export the client for use in other modules
})
export class RedisDbModule {}
