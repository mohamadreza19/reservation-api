import { Injectable } from '@nestjs/common';
import { GeneratedOtpDto, SendOtpDto } from '../dto/otp.dto';
import { SmsService } from 'src/common/services';

@Injectable()
export class OtpService {
  constructor(private readonly sms: SmsService) {}
  generateOtp(): GeneratedOtpDto {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 3 * 60 * 1000); // 3min

    return {
      otp,
      expires,
    };
  }

  async sendOtp(dto: SendOtpDto) {
    return this.sms.sendOtp(dto);
  }
}
