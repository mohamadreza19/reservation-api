import { Inject, Injectable } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';
import { IRedisStorageService } from 'src/common/models/redis';

@Injectable()
export class ReminderRedisService implements IRedisStorageService<any> {
  constructor(@Inject('REDIS_REMINDER_CLIENT') private readonly redis: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  async get(key: string): Promise<any | null> {
    const val = await this.redis.get(key);
    return val ? JSON.parse(val) : null;
  }
  async del(...args: [...keys: RedisKey[]]): Promise<number> {
    return this.redis.del(args);
  }
}
