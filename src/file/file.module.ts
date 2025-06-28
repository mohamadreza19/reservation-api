// file.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { DynamicEntityService } from './dynamic-entity.service';
import { User } from '../user/entities/user.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../service/entities/service.entity';
import {
  FileServiceConfig,
  defaultFileServiceConfig,
} from './config/file.config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Business, Service]), ConfigModule],
  controllers: [FileController],
  providers: [FileService, DynamicEntityService],
  exports: [FileService],
})
export class FileModule {
  static forRoot(config?: Partial<FileServiceConfig>): DynamicModule {
    return {
      module: FileModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User, Business, Service]),
      ],
      controllers: [FileController],
      providers: [
        FileService,
        DynamicEntityService,
        {
          provide: 'FILE_SERVICE_CONFIG',
          useFactory: (configService: ConfigService) => ({
            ...defaultFileServiceConfig,
            ...config,
            ...configService.get<FileServiceConfig>('fileServiceConfig'),
          }),
          inject: [ConfigService],
        },
      ],
      exports: [FileService],
    };
  }
}
