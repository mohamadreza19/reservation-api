// bullmq-config.module.ts
import { Module, Inject } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_SERVICE_NAME, // host or REDIS_URL parsed for hostname and port
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
})
export class BullMQConfigModule {}
