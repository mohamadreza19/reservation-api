import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryService } from 'src/common/services/query.service';
import { Business } from '../business/entities/business.entity';
import {
  CreateServiceDto,
  FindServiceByBusiness,
  FindServicesDto,
  UpdateServiceArgsDto,
  UpdateServiceDto,
} from './dto/service.dto';
import {
  FindOneById,
  FindByUserAccess,
  PaginatedResult,
  Update,
} from 'src/common/models/model';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { BusinessService } from 'src/business/business.service';
import { PriceService } from 'src/price/price.service';
import { DynamicEntityService } from '../file/dynamic-entity.service';

@Injectable()
export class ServiceService
  implements FindByUserAccess<Service>, Update<Service>, FindOneById<Service>
{
  private readonly logger = new Logger(ServiceService.name);
  queryService: QueryService<Service>;
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    private businessService: BusinessService,
    private priceService: PriceService,
  ) {
    this.queryService = new QueryService(serviceRepo);
  }
  async findOneById(id: string): Promise<Service | null> {
    return this.serviceRepo.findOneBy({ id });
  }

  async findByUserAccess(id: string, user: User): Promise<Service | null> {
    if (user.role == Role.SUPER_ADMIN) {
      return this.serviceRepo.findOneBy({ id });
    } else if (user.role == Role.BUSINESS_ADMIN) {
      return this.serviceRepo.findOneBy({ id, isSystemService: false });
    }

    return null;
  }

  async findAll(
    user: User,
    dto: FindServicesDto,
  ): Promise<PaginatedResult<Service>> {
    const {
      page,
      limit,

      isSystemService,
    } = dto;
    const filters = { isSystemService };

    const [services, count] = await this.serviceRepo.findAndCount({
      where: {
        isSystemService: true,
      },
      select: {
        id: true,
        name: true,
        icon: true,
        isSystemService: true,
      },
    });

    return {
      data: services,
      page: 1,
      limit: 9999,
      total: count,
    };
  }

  async findSystemServices(
    businessId: string | null,
    query: FindServiceByBusiness,
  ) {
    const page = 1;
    const limit = 999;
    const skip = (page - 1) * limit;

    const qb = this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.price', 'price'); // ✅ always join price
    const { isSystemService, parentId } = query;
    // .where('service.isSystemService = :isSystem', { isSystem: true });

    // Filter for system services

    if (isSystemService) {
      qb.where('service.isSystemService = :isSystem', { isSystem: true });

      // If businessId is provided, find system services that have children services belonging to the business
      if (businessId) {
        qb.innerJoin(
          'service.children',
          'childService',
          'childService.businessId = :businessId',
          { businessId },
        );
      }
      const [data, total] = await qb.getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
      };
    }
    if (parentId && businessId) {
      // Filter for non-system services with specific parentId and businessId
      qb.where('service.businessId = :businessId', { businessId }).andWhere(
        'service.parentId = :parentId',
        { parentId },
      );
    } else if (businessId) {
      // Filter for non-system services with specific businessId
      qb.where('service.businessId = :businessId', { businessId });
    }

    qb.skip(skip).take(limit);

    // // Optional: Filter by businessId if provided
    // if (businessId) {
    //   qb.andWhere('service.businessId = :businessId', { businessId });
    // }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
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

  async create(createServiceDto: CreateServiceDto, user: User) {
    // Prevent creating new system services
    if (user.role == Role.BUSINESS_ADMIN && createServiceDto.isSystemService) {
      throw new ForbiddenException('Cannot create new system services');
    }
    const business = await this.businessService.findByUserId(user.id);

    if (!business) {
      throw new ForbiddenException('problem with business');
    }
    const service = this.serviceRepo.create({ ...createServiceDto });
    service.business = business;

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

    return await this.serviceRepo.save(service);
  }
  async updateByAuthorizeUser(
    id: string,
    updateDto: UpdateServiceDto,
    user: User,
  ) {
    const business = await this.businessService.findByUserId(user.id);
    const service = await this.serviceRepo.findOne({
      where: {
        id,
        business: {
          id: business.id,
        },
        parent: {
          id: updateDto.parentId,
        },
      },
      relations: ['price'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    // Prevent modifying system services
    if (service.isSystemService) {
      throw new ForbiddenException('System services cannot be modified');
    }

    if (updateDto.price) {
      if (!service.price) {
        await this.priceService.create(
          {
            amount: updateDto.price.amount,
          },
          service,
        );
      } else {
        service.price.amount = updateDto.price.amount;
      }
    }

    return await this.serviceRepo.save(service);
  }
  async update(entities: DeepPartial<Service>) {
    return this.serviceRepo.save(entities);
  }

  async remove(id: string, user: User) {
    const business = await this.businessService.findByUserId(user.id);
    const service = await this.serviceRepo.findOne({
      where: {
        business,
        id: id,
      },
    });
    if (!service) {
      throw new NotFoundException();
    }
    return this.serviceRepo.remove(service);
  }
}
