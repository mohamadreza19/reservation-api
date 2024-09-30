import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProfile } from './entities/service-profile.entity';
import { Repository } from 'typeorm';
import { BusinessService } from '../business/business.service';
import { EmployeeService } from '../employee/employee.service';
import { UserPayload } from 'src/shared/types/user-payload.interface';

@Injectable()
export class ServiceProfileService {
  constructor(
    @InjectRepository(ServiceProfile)
    private readonly serviceProfileRepository: Repository<ServiceProfile>,
    private readonly businessService: BusinessService,
    private readonly employeeService: EmployeeService,
  ) {}
  async create(
    createServiceProfileDto: CreateServiceProfileDto,
    user: UserPayload,
  ) {
    const business = await this.businessService.findOneById(user.userId);

    const employees = await this.employeeService.findByBusinessAndEmployeeIds(
      business.id,
      createServiceProfileDto.employeeIds,
    );
    console.log(createServiceProfileDto);
    return 'This action adds a new serviceProfile';
  }

  findAll() {
    return `This action returns all serviceProfile`;
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
