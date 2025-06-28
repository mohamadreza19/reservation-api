import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class DynamicEntityService {
  private allowedEntities: Record<
    string,
    { repo: Repository<any>; fileField: string }
  >;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {
    this.allowedEntities = {
      user: { repo: this.userRepo, fileField: 'avatarPath' },
      business: { repo: this.businessRepo, fileField: 'logoPath' },
      service: { repo: this.serviceRepo, fileField: 'icon' },
    };
  }

  getAllowedEntities(): string[] {
    return Object.keys(this.allowedEntities);
  }

  getFileField(entity: string): string | null {
    return this.allowedEntities[entity.toLowerCase()]?.fileField ?? null;
  }

  getRepository(entity: string): Repository<any> {
    const config = this.allowedEntities[entity.toLowerCase()];
    if (!config) {
      throw new Error(`Invalid entity: ${entity}`);
    }
    return config.repo;
  }

  isEntityAllowed(entity: string): boolean {
    return entity.toLowerCase() in this.allowedEntities;
  }
}
