import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPayload } from 'src/shared/types/user-payload.interface';
import { Repository } from 'typeorm';
import { BusinessService } from '../business/business.service';
import { EmployeeService } from '../employee/employee.service';
import { ServiceCategoryService } from '../service-category/service-category.service';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';
import { ServiceProfile } from './entities/service-profile.entity';

@Injectable()
export class ServiceProfileService {
  constructor(
    @InjectRepository(ServiceProfile)
    private readonly serviceProfileRepository: Repository<ServiceProfile>,

    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}
  async create(
    createServiceProfileDto: CreateServiceProfileDto,
    user: UserPayload,
  ) {
    const serviceCategory = await this.serviceCategoryService.findOneById(
      createServiceProfileDto.serviceCategoryId,
    );

    if (!serviceCategory) {
      throw new BadRequestException('Service Category Not Found');
    }

    const employees = await this.employeeService.findByBusinessAndEmployeeIds(
      user.userId,
      createServiceProfileDto.employeeIds,
    );

    if (!employees.length) {
      throw new BadRequestException('Employees Not Found');
    }

    const serviceProfile = this.serviceProfileRepository.create({
      employees: employees,
      business: {
        id: user.userId,
      },
      serviceCategory: serviceCategory,
      name: createServiceProfileDto.name,
      deposit: createServiceProfileDto.deposit,
    });

    const createdServiceProfile =
      await this.serviceProfileRepository.save(serviceProfile);

    return {
      id: createdServiceProfile.id,
      name: createdServiceProfile.name,
      businessId: createdServiceProfile.business.id,
      deposit: createdServiceProfile.deposit,
      serviceCategoryId: createdServiceProfile.serviceCategory.id,
      employees: createdServiceProfile.employees,
    };
  }

  async findAllByBusinessId(businessId: number) {
    return await this.serviceProfileRepository.find({
      where: {
        business: {
          id: businessId,
        },
      },
      relations: ['employees'],
    });
  }

  async findOneByIdBasedBusinessId(
    serviceProfileId: number,
    businessId: number,
  ) {
    return await this.serviceProfileRepository.findOne({
      where: {
        id: serviceProfileId,
        business: {
          id: businessId,
        },
      },
      relations: ['employees'],
    });
  }
  findOne(id: number) {
    return `This action returns a #${id} serviceProfile`;
  }

  update(id: number, updateServiceProfileDto: UpdateServiceProfileDto) {
    return `This action updates a #${id} serviceProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceProfile`;
  }
}
