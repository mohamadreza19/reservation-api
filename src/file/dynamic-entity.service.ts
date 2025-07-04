import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../service/entities/service.entity';
import { Role } from 'src/common/enums/role.enum';
import { FileModuleDependencyService } from 'src/common/models/model';
import { ServiceService } from 'src/service/service.service';
import { Entities } from 'src/common/enums/entities.enum';
import {
  defaultFileServiceConfig,
  StorageProfile,
  StorageProfileConfig,
} from './config/file.config';

@Injectable()
export class DynamicEntityService {
  private allowedEntities: Record<
    Entities,
    {
      repo: FileModuleDependencyService;
      fileField: string;
      storageProfile: StorageProfileConfig;
    }
  >;

  constructor(private readonly serService: ServiceService) {
    this.allowedEntities = {
      // user: { repo: this.userRepo, fileField: 'avatarPath' },
      // business: { repo: this.businessRepo, fileField: 'logoPath' },
      business: {
        repo: undefined as any,
        fileField: 'logoPath',
        storageProfile:
          defaultFileServiceConfig.profiles[StorageProfile.BUSINESS_ASSETS],
      },
      service: {
        repo: this.serService,
        fileField: 'icon',
        storageProfile:
          defaultFileServiceConfig.profiles[StorageProfile.SERVICE_ICONS],
      },
    };
  }

  getAllowedEntities(): string[] {
    return Object.keys(this.allowedEntities);
  }

  getFileField(entity: string): string | null {
    return this.allowedEntities[entity.toLowerCase()]?.fileField ?? null;
  }

  getRepository(entity: string): FileModuleDependencyService {
    const config = this.allowedEntities[entity.toLowerCase()];
    if (!config) {
      throw new Error(`Invalid entity: ${entity}`);
    }
    return config.repo;
  }
  getStorageProfile(entity: string): StorageProfileConfig {
    const config = this.allowedEntities[entity.toLowerCase()];

    if (!config) {
      throw new Error(`Invalid entity: ${entity}`);
    }
    return config.storageProfile;
  }

  isEntityAllowed(entity: string): boolean {
    return entity.toLowerCase() in this.allowedEntities;
  }
}
