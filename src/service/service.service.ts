import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { BusinessService } from 'src/business/business.service';
import { Role } from 'src/common/enums/role.enum';
import {
  FindByUserAccess,
  FindOneById,
  PaginatedResult,
  Update,
} from 'src/common/models/model';
import { QueryService } from 'src/common/services/query.service';
import { PriceService } from 'src/price/price.service';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';
import {
  CreateServiceDto,
  FindServiceByBusiness,
  FindServicesDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { Plan } from './entities/plan.entity';
import { Service } from './entities/service.entity';
import { TimeslotService } from 'src/time-slot/time-slot.service';
import * as moment from 'moment-jalaali';

@Injectable()
export class ServiceService
  implements FindByUserAccess<Service>, FindOneById<Service>, Update<Service>
{
  private readonly logger = new Logger(ServiceService.name);
  queryService: QueryService<Service>;
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
    private businessService: BusinessService,
    private priceService: PriceService,
    @Inject(forwardRef(() => TimeslotService))
    private timeslots: TimeslotService,
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
        plan: true,
      },
    });

    return {
      data: services,
      page: 1,
      limit: 9999,
      total: count,
    };
  }
  async findAllByIds(ids: string[]) {
    return this.serviceRepo.find({
      where: {
        id: In(ids),
      },
    });
  }
  findByBusinessId(businessId: string, ids?: string[]) {
    if (ids && ids.length) {
      return this.serviceRepo.find({
        where: {
          id: In(ids),
          business: { id: businessId },
          isSystemService: false,
        },
      });
    }
    return this.serviceRepo.find({
      where: { business: { id: businessId }, isSystemService: false },
    });
  }
  findOneByBusinessId(businessId: string, serviceId: string) {
    return this.serviceRepo.findOne({
      where: {
        id: serviceId,
        business: { id: businessId },
        isSystemService: false,
      },
    });
  }
  async _findByBusinessId(
    businessId: string,
    { parentId }: FindServiceByBusiness,
  ) {
    const bus = await this.businessService.findOneById(businessId);

    if (!bus) throw BadRequestException;

    const baseWhere: FindOptionsWhere<Service> = {
      business: {
        id: bus.id,
      },
    };

    if (!parentId) {
      return this.serviceRepo.find({
        where: baseWhere,
      });
    } else {
      return this.serviceRepo.find({
        where: {
          ...baseWhere,
          parent: {
            id: parentId,
          },
        },
      });
    }
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
    console.log('createServiceDto', createServiceDto);
    const service = this.serviceRepo.create(createServiceDto);
    service.business = business;
    console.log('service', service);
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
    console.log('lay');
    return await this.serviceRepo.save(service);
  }
  async updateByAuthorizeUser(
    id: string,
    updateDto: UpdateServiceDto,
    user: User,
  ) {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) throw new NotFoundException('Business not found');
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

    // Handle price update separately to avoid constraint violations
    const { price, ...serviceUpdateData } = updateDto;

    // Assign non-price properties to service
    Object.assign(service, serviceUpdateData);

    // Handle price update
    if (price) {
      if (!service.price) {
        await this.priceService.create(
          {
            amount: price.amount,
          },
          service,
        );
      } else {
        await this.priceService.update(service.id, {
          amount: price.amount,
        });
      }
    }

    return await this.serviceRepo.save(service);
  }

  async updateById(id: string, updateServiceDto: UpdateServiceDto, user: User) {
    const business = await this.businessService.findByUserId(user.id);
    let isDurationUpdate = false;
    if (!business) throw new BadRequestException('Business not found');

    const service = await this.serviceRepo.findOne({
      where: {
        business: {
          id: business.id,
        },
        id,
      },
      relations: ['price'],
    });

    if (!service)
      throw new NotFoundException(
        `Service not found for business with Id ${business.id}`,
      );

    if (service.isSystemService)
      throw new BadRequestException('Cannot update system services');

    // Handle price update separately to avoid constraint violations
    const { price, ...serviceUpdateData } = updateServiceDto;
    if (
      updateServiceDto.durationInMinutes &&
      service.durationInMinutes !== updateServiceDto.durationInMinutes
    ) {
      isDurationUpdate = true;
    }
    // Assign non-price properties to service
    Object.assign(service, serviceUpdateData);

    if (isDurationUpdate) {
      const schedules = await this.timeslots.findSchedulesByService(service.id);

      if (!schedules.length)
        throw new BadRequestException('Schedules not found');
      for (const schedule of schedules) {
        const dates = await this.timeslots.findDatesBySchedule(schedule.id);

        await this.timeslots.deleteTimeslotsBySchedule(schedule.id, [
          service.id,
        ]);

        for (const { date } of dates) {
          const dateMoment = moment(date, 'YYYY-MM-DD');
          await this.timeslots.generateTimeslotsFromSchedule({
            businessId: business.id,
            date: dateMoment,
            schedule,
            services: [service],
          });
        }
      }
    }

    // Handle price update
    if (price) {
      if (!service.price) {
        // Create new price if service doesn't have one
        await this.priceService.create(
          {
            amount: price.amount,
          },
          service,
        );
      } else {
        // Update existing price
        await this.priceService.update(service.id, {
          amount: price.amount,
        });
      }
    }

    // Save the updated service
    await this.serviceRepo.save(service);
  }

  async update(
    entities: DeepPartial<Service>,
  ): Promise<DeepPartial<Service> & Service> {
    return await this.serviceRepo.save(entities as Service);
  }

  async remove(id: string, user: User) {
    const business = await this.businessService.findByUserId(user.id);
    if (!business) throw new NotFoundException('Business not found');
    console.log(id);
    const service = await this.serviceRepo.findOne({
      where: {
        business: {
          id: business.id,
        },
        id: id,
        isSystemService: false,
      },
    });
    console.log(service);
    if (!service) {
      throw new NotFoundException();
    }
    return this.serviceRepo.remove(service);
  }

  async findAllPlans() {
    return this.planRepo.find();
  }
  async findSystems() {
    return this.serviceRepo.find({
      where: {
        isSystemService: true,
      },
    });
  }
}
