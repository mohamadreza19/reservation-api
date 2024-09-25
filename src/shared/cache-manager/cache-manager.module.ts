import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
})
export class CacheManagerModule {}
