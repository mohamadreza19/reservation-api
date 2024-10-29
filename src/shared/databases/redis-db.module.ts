// redis-db.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_SERVICE_NAME,
  port: Number(process.env.REDIS_PORT) || 6379,
});

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisDbModule {}

export { redisClient };
