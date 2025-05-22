import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

import { BusinessService } from '../business/business.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    authUser: User,
  ): Promise<Employee> {
    // Verify the authenticated user is the BUSINESS_ADMIN of the specified business
    const business = await this.businessService.findByUserId(authUser.id);
    if (business.id || authUser.role !== Role.BUSINESS_ADMIN) {
      throw new UnauthorizedException(
        'You can only create employees for your own business',
      );
    }

    // Fetch and validate the user (if provided)
    let user: User | null = null;
    if (createEmployeeDto.userId) {
      user = await this.userService.findOne(createEmployeeDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    // Create the employee
    const employee = this.employeeRepo.create({
      ...createEmployeeDto,
      business: business,
      userInfo: user,
    });

    return this.employeeRepo.save(employee);
  }

  async findAllForBusiness(businessId: string): Promise<Employee[]> {
    return this.employeeRepo.find({
      where: { business: { id: businessId } },
      relations: ['userInfo', 'appointments'],
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: ['userInfo', 'business', 'appointments'],
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    authUser: User,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    // Verify the authenticated user is the BUSINESS_ADMIN of the employee's business
    const business = await this.businessService.findByUserId(authUser.id);
    if (
      business.id !== employee.business.id ||
      authUser.role !== Role.BUSINESS_ADMIN
    ) {
      throw new UnauthorizedException(
        'You can only update employees in your own business',
      );
    }

    // Update only allowed fields
    // if (updateEmployeeDto.fullName !== undefined) {
    //   employee.fullName = updateEmployeeDto.fullName;
    // }
    // if (updateEmployeeDto.specialization !== undefined) {
    //   employee.specialization = updateEmployeeDto.specialization;
    // }

    return this.employeeRepo.save(employee);
  }

  async remove(id: string, authUser: User): Promise<void> {
    const employee = await this.findOne(id);

    // Verify the authenticated user is the BUSINESS_ADMIN of the employee's business
    const business = await this.businessService.findByUserId(authUser.id);
    if (
      business.id !== employee.business.id ||
      authUser.role !== Role.BUSINESS_ADMIN
    ) {
      throw new UnauthorizedException(
        'You can only delete employees in your own business',
      );
    }

    await this.employeeRepo.remove(employee);
  }
}
