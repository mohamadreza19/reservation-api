import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { SendOtpDto } from 'src/auth/dto/otp.dto';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiUrl = 'https://edge.ippanel.com/v1/api/send';
  private readonly fromNumber = '+983000505';
  private readonly patternCode = 'sa7baep8sklqk7q';
  private readonly authHeader = 'YozxdWeULThTwnGx9THvCHNnsDSq6ISeM0qY6Z9druA=';

  async sendOtp({ otp, phoneNumber }: SendOtpDto): Promise<void> {
    try {
      const payload = {
        sending_type: 'pattern',
        from_number: this.fromNumber,
        code: this.patternCode,
        recipients: [phoneNumber],
        params: {
          'verification-code': otp,
        },
      };
      await axios.post(this.apiUrl, payload, {
        // httpAgent: new Agent({ keepAlive: true }),
        // httpsAgent: new HttpsAgent({ keepAlive: true }),
        headers: {
          Authorization: this.authHeader,

          // 'User-Agent': 'PostmanRuntime/7.35.0',
        },
        proxy: false,
      });
      this.logger.log(`OTP sent to ${phoneNumber}`);
    } catch (error) {
      // this.logger.error(
      //   `Failed to send OTP to ${phoneNumber}: ${error.message}`,
      // );
      this.logger.error(`Failed to send OTP to ${phoneNumber}`, error);
    }
  }
}
