// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const synchronize =
          configService.get<string>('DB_SYNCHRONIZE') === 'true';

        console.log('DATABASE_URL', configService.get<string>('DATABASE_URL'));
        console.log('DB_SYNCHRONIZE', synchronize);

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize, // controlled by env
          // ssl: configService.get<string>('NODE_ENV') === 'production'
          //   ? { rejectUnauthorized: false }
          //   : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
