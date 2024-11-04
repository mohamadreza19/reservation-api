import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
@Global()
@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  providers: [OtpService],
  exports: [OtpService],
})
export class CacheManagerModule {}
