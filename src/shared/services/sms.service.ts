import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { Axios, AxiosInstance } from 'axios';

@Injectable()
export class SmsService {
  private axios: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.axios = axios.create({
      baseURL: this.configService.get<string>('SMS_SERVICE_URL'),
      headers: {
        Authorization: `Bearer ${this.configService.get<string>('SMS_SERVICE_TOKEN')}`,
      },
    });
  }

  
}
