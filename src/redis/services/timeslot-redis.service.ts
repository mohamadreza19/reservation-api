import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TimeslotRedisService {
  constructor(@Inject('REDIS_TIMESLOT_CLIENT') private readonly redis: Redis) {}
}
