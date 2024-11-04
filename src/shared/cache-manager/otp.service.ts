import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateOtp(key: string): Promise<string> {
    const EXPIRE_TIME = 4 * 60 * 1000;
    let otp = this.codeGenerator();

    await this.cacheManager.set(key, otp, EXPIRE_TIME); // Expires in 4 minutes
    return otp;
  }

  async validateOtp(key: string, otp: string): Promise<boolean> {
    const storedOtp = await this.cacheManager.get(key);

    if (storedOtp === otp) {
      await this.cacheManager.del(key); // Delete OTP after successful validation
      return true;
    }
    return false;
  }

  private codeGenerator() {
    const LENGTH = 5;
    let arr = [];
    let otp: number;

    for (let index = 0; index < LENGTH; index++) {
      const digit = Math.floor(Math.random() * 9);
      arr.push(digit);
    }

    return arr.join('');
  }
}
