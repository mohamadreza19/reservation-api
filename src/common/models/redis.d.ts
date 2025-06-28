import { RedisKey } from 'ioredis';

export interface IRedisStorageService<T> {
  set(key: string, value: T, ttl?: number): Promise<void>;
  get(key: string): Promise<T | null>;
  del(...args: [...keys: RedisKey[]]): Promise<number>;
}
