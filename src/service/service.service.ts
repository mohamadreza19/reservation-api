import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryService } from 'src/common/services/query.service';
import { Business } from '../business/entities/business.entity';
import {
  CreateServiceDto,
  FindServicesDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { PaginatedResult } from 'src/common/models/model';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { BusinessService } from 'src/business/business.service';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);
  queryService: QueryService<Service>;
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    private businessService: BusinessService,
    // @InjectRepository(Business)
    // private readonly businessRepo: Repository<Business>,
  ) {
    this.queryService = new QueryService(serviceRepo);
  }

  async create(createServiceDto: CreateServiceDto, user: User) {
    // Prevent creating new system services
    if (user.role == Role.BUSINESS_ADMIN && createServiceDto.isSystemService) {
      throw new ForbiddenException('Cannot create new system services');
    }
    const business = await this.businessService.findByUserId(user.id);

    if (!business) {
      throw new ForbiddenException('problem with business');
    }
    const service = this.serviceRepo.create({ ...createServiceDto, business });

    // Handle business association if provided
    // if (createServiceDto.businessId) {
    //   const business = await this.businessRepo.findOne({
    //     where: { id: createServiceDto.businessId },
    //   });
    //   if (!business) {
    //     throw new NotFoundException(
    //       `Business with ID ${createServiceDto.businessId} not found`,
    //     );
    //   }
    //   service.business = business;
    // }

    // Handle parent service

    // Validate name uniqueness for non-system services within the business
    if (!createServiceDto.isSystemService) {
      const existingService = await this.serviceRepo.findOne({
        where: {
          name: createServiceDto.name,
          business: { id: business.id },
          isSystemService: false,
        },
      });
      if (existingService) {
        throw new BadRequestException(
          `A service with name "${createServiceDto.name}" already exists for this business`,
        );
      }
    }
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

  async findAll(dto: FindServicesDto): Promise<PaginatedResult<Service>> {
    const {
      page,
      limit,
      // sort,
      // businessId,
      // parentId,
      isSystemService,
      // rootOnly,
    } = dto;
    const filters = { isSystemService };

    this.logger.debug(
      `Processing findAll with filters: ${JSON.stringify(filters)}`,
    );

    return this.queryService.findAll(
      {
        page,
        limit,
        sort: '',
        filters,
        relations: ['parent', 'children'],
      },
      (filters) => {
        const where: FindOptionsWhere<Service> = {};
        // console.log('filters', Boolean(filters.isSystemService));
        // if (filters.businessId) {
        //   where.business = { id: filters.businessId };
        // }

        if (filters.isSystemService !== undefined) {
          where.isSystemService = filters.isSystemService;
        }

        // if (filters.parentId) {
        //   where.parent = { id: filters.parentId };
        // } else if (filters.rootOnly !== undefined && filters.rootOnly) {
        //   where.parent = null as any;
        // }

        this.logger.debug(`Generated where clause: ${JSON.stringify(where)}`);
        return where;
      },
    );
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
    // if (updateServiceDto.businessId) {
    //   const business = await this.businessRepo.findOne({
    //     where: { id: updateServiceDto.businessId },
    //   });
    //   if (!business) {
    //     throw new NotFoundException(
    //       `Business with ID ${updateServiceDto.businessId} not found`,
    //     );
    //   }
    //   service.business = business;
    // }

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
}
