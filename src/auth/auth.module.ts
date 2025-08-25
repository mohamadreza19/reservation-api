// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { BusinessModule } from '../business/business.module';

import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomerModule } from 'src/customer/customer.module';
import { SmsService } from 'src/common/services';
import { OtpService } from './services/otp.service';

@Module({
  imports: [
    ConfigModule, // Make sure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallback-secret-key'),
        signOptions: {
          expiresIn: '24h', // Access token expires in 15 minutes
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    BusinessModule,
    CustomerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    JwtStrategy,
    SmsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
