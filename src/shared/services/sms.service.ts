import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface OtpPattern {
  code: string;
  sender: string;
  recipient: string;
  variable: {
    'verification-code': string; // max length is 5
  };
}

@Injectable()
export class SmsService {
  private otpAxiosService: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.otpAxiosService = axios.create({
      baseURL: this.configService.get<string>('SMS_PATTERN_SERVICE_URL'),
      headers: {
        apikey: `${this.configService.get<string>('SMS_SERVICE_TOKEN')}`,
      },
    });
  }

  async sendOtp(recipient: string, otp: string) {
    const data = this._getOtpPattern(recipient, otp);
    return (await this.otpAxiosService.post('pattern/normal/send', data)).data;
  }
  private _getOtpPattern(recipient: string, otp: string) {
    const pattern: OtpPattern = {
      code: this.configService.get<string>('SMS_OTP_ID'),
      sender: this.configService.get<string>('SMS_SENDER_NUMBER'),
      recipient: recipient,
      variable: {
        'verification-code': otp,
      },
    };

    return pattern;
  }
}
