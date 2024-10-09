import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

import { S3ConfigService } from './s3-config.service';

@Module({
  providers: [StorageService, S3ConfigService],
})
export class StorageModule {}
