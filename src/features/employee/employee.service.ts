import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnrelatedEmployeeIdsException } from 'src/shared/exceptions/unrelated-employee-ids.exception';
import { UserPayload } from 'src/shared/types/user-payload.interface';
import { In, Repository } from 'typeorm';
import { BusinessService } from '../business/business.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly businessService: BusinessService,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto, user: UserPayload) {
    const business = await this.businessService.findOneById(user.userId);

    if (!business) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action. Business not found.',
      );
    }

    const employeeInstance = this.employeeRepository.create({
      name: createEmployeeDto.name,
      business: business,
    });
    const createdemployee =
      await this.employeeRepository.save(employeeInstance);

    return {
      id: createdemployee.id,
      name: createdemployee.name,
      businessId: createdemployee.business.id,
    };
  }

  findAll() {
    return `This action returns all employee`;
  }
  async findAllByBusiness(user: UserPayload) {
    const business = await this.businessService.findOneById(user.userId);

    if (!business) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action. Business not found.',
      );
    }
    return await this.employeeRepository.find({
      where: { business: { id: user.userId } },
      // relations: ['businessCategory'],
    });
  }
  async findByBusinessAndEmployeeIds(
    businessId: number,
    employeeIds: number[],
  ): Promise<Employee[]> {
    const employees = await this.employeeRepository.find({
      where: {
        business: {
          id: businessId,
        },
        id: In(employeeIds),
      },
    });

    this.validateEmployeeIds(employeeIds, employees);

    return employees;
  }
  private validateEmployeeIds(
    employeeIds: number[],
    employees: Employee[],
  ): void {
    const foundEmployeeIds = employees.map((employee) => employee.id);
    const missingEmployeeIds = employeeIds.filter(
      (id) => !foundEmployeeIds.includes(id),
    );

    if (missingEmployeeIds.length > 0) {
      throw new UnrelatedEmployeeIdsException(missingEmployeeIds);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
