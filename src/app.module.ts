import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { CustomerModule } from './features/customer/customer.module';

import { BusinessModule } from './features/business/business.module';
import { EmployeeModule } from './features/employee/employee.module';
import { BusinessCategory } from './features/business-category/entities/business-category.entity';
import { ServiceCategory } from './features/business-category/entities/service-category.entity';
import { ServiceProfileModule } from './features/service-profile/service-profile.module';

import { OtpModule } from './features/otp/otp.module';
import { AuthModule } from './features/auth/auth.module';

import { RedisModule } from 'nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the environment variables available globally
      envFilePath: '.env', // Specifies the path to the .env file
    }),
    DatabaseModule,
    CustomerModule,
    BusinessModule,
    BusinessCategory,
    ServiceCategory,
    EmployeeModule,
    ServiceProfileModule,
    OtpModule,
    AuthModule,
    // RedisDatabaseModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST', 'localhost'), // Read host from env or fallback to localhost
        port: configService.get<number>('REDIS_PORT', 6379), // Read port from env or fallback to 6379
        db: configService.get<number>('REDIS_DB', 0), // Redis DB number from env or default to 0
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
