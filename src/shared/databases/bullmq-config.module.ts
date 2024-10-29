// bullmq-config.module.ts
import { Module, Inject } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (redis) => ({
        connection: redis, // Use the injected redis client
      }),
      inject: ['REDIS_CLIENT'], // Inject the redis client created in redis-db.module
    }),
  ],
})
export class BullMQConfigModule {}
