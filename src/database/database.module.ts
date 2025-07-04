// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { createDatabaseConfig } from './factories/database.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        // entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
        // ssl: {
        //   rejectUnauthorized: false, // Needed for Render
        // },
        dropSchema: true, // development mode only
        autoLoadEntities: true,
        synchronize: true, // Use migrations instead in production
      }),
    }),
  ],
})
export class DatabaseModule {}
