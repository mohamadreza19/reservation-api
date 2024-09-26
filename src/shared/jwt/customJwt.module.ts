import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> | JwtModuleOptions => {
        return {
          secret: configService.get<string>('JWT_SECRET'), // Provide your secret key here
          signOptions: { expiresIn: '60m' },
        };
      },
      global: true,
    }),
  ],
})
export class CustomJwtModule {}
