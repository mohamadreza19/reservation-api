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
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [ServiceModule, ConfigModule],
  controllers: [FileController],
  providers: [FileService, DynamicEntityService],
  exports: [FileService, DynamicEntityService],
})
export class FileModule {}
