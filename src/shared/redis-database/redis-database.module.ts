import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class RedisDatabaseModule {}
