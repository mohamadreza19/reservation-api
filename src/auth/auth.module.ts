// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { BusinessModule } from '../business/business.module';

import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomerModule } from 'src/customer/customer.module';
import { SmsService } from 'src/common/services';

@Module({
  imports: [
    ConfigModule, // Make sure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallback-secret-key'),
        signOptions: { expiresIn: '4h' },
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
    JwtStrategy,
    SmsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
  ],
})
export class AuthModule {}
