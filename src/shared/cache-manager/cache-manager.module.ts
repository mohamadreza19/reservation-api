import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  providers: [OtpService],
  exports: [OtpService],
})
export class CacheManagerModule {}
