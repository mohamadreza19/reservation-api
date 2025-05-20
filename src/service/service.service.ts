import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { QueryService } from 'src/common/services/query.service';
import { Business } from '../business/entities/business.entity';

@Injectable()
export class ServiceService {
  queryService: QueryService<Service>;
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {
    this.queryService = new QueryService(serviceRepo);
  }

  async create(createServiceDto: CreateServiceDto) {
    // Prevent creating new system services
    if (createServiceDto.isSystemService) {
      throw new ForbiddenException('Cannot create new system services');
    }

    const service = this.serviceRepo.create(createServiceDto);

    // Handle business association if provided
    if (createServiceDto.businessId) {
      const business = await this.businessRepo.findOne({
        where: { id: createServiceDto.businessId },
      });
      if (!business) {
        throw new NotFoundException(
          `Business with ID ${createServiceDto.businessId} not found`,
        );
      }
      service.business = business;
    }

    // Handle parent service
    if (createServiceDto.parentId) {
      const parent = await this.serviceRepo.findOne({
        where: { id: createServiceDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent service with ID ${createServiceDto.parentId} not found`,
        );
      }

      // Verify parent is a system service
      if (!parent.isSystemService) {
        throw new ForbiddenException(
          'Can only create children under system services',
        );
      }

      service.parent = parent;
    } else {
      // Only system services can be root level
      throw new ForbiddenException(
        'All non-system services must have a parent',
      );
    }

    return this.serviceRepo.save(service);
  }

  async findAll(options: any = {}) {
    // Ensure we always include relations for the tree structure
    const queryOptions = {
      ...options,
      relations: [
        ...(options.relations || []),
        'business',
        'parent',
        'children',
      ],
    };

    return this.queryService.findAll(queryOptions, (filters) => {
      const where: any = {};

      // Handle business filter
      if (filters.businessId) {
        where.business = { id: filters.businessId };
      }

      // Handle system services filter
      if (filters.isSystemService !== undefined) {
        where.isSystemService = filters.isSystemService;
      }

      // Handle parent filter
      if (filters.parentId) {
        where.parent = { id: filters.parentId };
      } else if (filters.rootOnly) {
        where.parent = null;
      }

      return where;
    });
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['business', 'parent', 'children'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['business', 'parent'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    // Prevent modifying system services
    if (service.isSystemService) {
      throw new ForbiddenException('System services cannot be modified');
    }

    // Handle business update
    if (updateServiceDto.businessId) {
      const business = await this.businessRepo.findOne({
        where: { id: updateServiceDto.businessId },
      });
      if (!business) {
        throw new NotFoundException(
          `Business with ID ${updateServiceDto.businessId} not found`,
        );
      }
      service.business = business;
    }

    // Handle parent update
    if (updateServiceDto.parentId !== undefined) {
      if (updateServiceDto.parentId) {
        const parent = await this.serviceRepo.findOne({
          where: { id: updateServiceDto.parentId },
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent service with ID ${updateServiceDto.parentId} not found`,
          );
        }
        if (!parent.isSystemService) {
          throw new ForbiddenException(
            'Can only assign system services as parent',
          );
        }
        service.parent = parent;
      } else {
        throw new ForbiddenException(
          'All non-system services must have a parent',
        );
      }
    }

    // Update other fields
    Object.assign(service, updateServiceDto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    // Prevent removing system services
    if (service.isSystemService) {
      throw new ForbiddenException('System services cannot be removed');
    }

    // Check if service has children
    if (service.children && service.children.length > 0) {
      throw new ForbiddenException('Cannot delete service with child services');
    }

    return this.serviceRepo.remove(service);
  }

  // Additional methods for system services
  async findSystemServices() {
    return this.findAll({ filters: { isSystemService: true } });
  }

  async findByBusiness(businessId: string) {
    return this.findAll({
      filters: { businessId, isSystemService: false },
      relations: ['parent'],
    });
  }
}
