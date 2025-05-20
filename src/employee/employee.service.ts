import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import { BusinessService } from '../business/business.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // const business = await this.businessService.findOne(
    //   createEmployeeDto.businessId,
    // );
    // if (!business) {
    //   throw new NotFoundException('Business not found');
    // }
    // const user = await this.userService.findOne(createEmployeeDto.userId);
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    // const employee = this.employeeRepo.create({
    //   ...createEmployeeDto,
    //   business,
    //   user,
    // });
    // return this.employeeRepo.save(employee);
  }

  async findAllForBusiness(businessId: string) {
    return this.employeeRepo.find({
      where: { business: { id: businessId } },
      relations: ['user', 'appointments'],
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: ['user', 'business', 'appointments'],
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return this.employeeRepo.save(employee);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    return this.employeeRepo.remove(employee);
  }
}
