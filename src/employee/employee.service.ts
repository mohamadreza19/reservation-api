import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { BusinessService } from 'src/business/business.service';
import { Business } from 'src/business/entities/business.entity';
import { EmployeeRegisterStatus } from 'src/common/enums/employee-register-status.enum';
import { Role } from 'src/common/enums/role.enum';
import { NotificationService } from 'src/notification/notification.service';
import { ServiceService } from 'src/service/service.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  AddServiceDto,
  EmployeeRegisterDto,
  FindRegisterRequestsDto,
  HireToBusinessDto,
  UpdateEmployeeRegisterDto,
} from './dto/employee.dto';
import { EmployeeRegister } from './entities/employee-register.entity';
import { Employee } from './entities/employee.entity';
import { tr } from '@faker-js/faker/.';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeRegister)
    private readonly employeeRegisterRepo: Repository<EmployeeRegister>,
    private readonly service: ServiceService,
    private readonly business: BusinessService,
    private readonly user: UserService,
    private readonly notification: NotificationService,
  ) {}
  private async buildRegisterRequestWhere(
    user: User,
    query: FindRegisterRequestsDto,
  ): Promise<FindOptionsWhere<EmployeeRegister>> {
    const where: FindOptionsWhere<EmployeeRegister> = {};

    if (user.role === Role.BUSINESS_ADMIN) {
      const business = await this.business.findByUserId(user.id);
      if (!business) throw new NotFoundException('Business not found');
      where.business = { id: business.id };
    } else if (user.role === Role.EMPLOYEE) {
      const employee = await this.findOneByUserId(user.id);
      if (!employee) throw new NotFoundException('Employee not found');
      where.employee = { id: employee.id };
    } else {
      throw new BadRequestException('Role not supported');
    }

    // Apply query filters
    if (query.employeeRegisterId) {
      where.id = query.employeeRegisterId;
    }
    if (query.status) {
      where.status = query.status as EmployeeRegisterStatus;
    }

    return where;
  }
  //

  async assignServices(user: User, addServiceDto: AddServiceDto) {
    const business = await this.business.findByUserId(user.id);

    if (!business) {
      throw new NotFoundException('Business not found');
    }
    const services = await this.service.findByBusinessId(
      business.id,
      addServiceDto.serviceIds,
    );
    console.log(services);
  }

  async createRegisterRequest(dto: EmployeeRegisterDto, user: User) {
    let business: Business | null;
    let businessUser = user;
    let employeeToRegister: Employee | null;

    let employeeRegister: EmployeeRegister | null;

    business = await this.business.findByUserId(businessUser.id);

    if (!business) throw new NotFoundException('Business not found');

    employeeToRegister = await this.findByPhoneNumber(dto.phoneNumber);

    if (!employeeToRegister)
      throw new NotFoundException('employee are not found');

    employeeRegister = await this.employeeRegisterRepo.findOneBy({
      business: { id: business.id },
      status: EmployeeRegisterStatus.ACCEPTED,
    });
    console.log('finded employeeRegister', employeeRegister);
    if (employeeRegister) {
      return 'employee already registered';
    }

    const employeeRegisterInstance = this.employeeRegisterRepo.create({
      business: {
        id: business.id,
      },
      employee: {
        id: employeeToRegister.id,
      },
    });

    await this.employeeRegisterRepo.save(employeeRegisterInstance);
  }

  async updateRegisterRequest(dto: UpdateEmployeeRegisterDto, user: User) {
    if (dto.status == EmployeeRegisterStatus.PENDING)
      throw new BadRequestException(
        `status ${EmployeeRegisterStatus.PENDING} not allowed`,
      );

    const employee = await this.findOneByUserId(user.id);

    if (!employee) throw new NotFoundException('Employee not found');

    const employeeRegister = await this.findRegisterByIdAndEmployeeId(
      dto.employeeRegisterId,
      employee.id,
    );
    if (!employeeRegister)
      throw new NotFoundException('Employee register request not found');

    if (employeeRegister.status !== EmployeeRegisterStatus.PENDING) {
      return;
    }

    const businessId = employeeRegister.business.id;

    if (!businessId)
      throw new NotFoundException('Business of register request not found');

    const business = await this.business.findOneById(businessId);

    if (!business)
      throw new NotFoundException('Business register request not found');

    await this.employeeRegisterRepo.update(employeeRegister.id, {
      status: dto.status,
    });
    await this.employeeRepo.update(employee.id, {
      business: { id: businessId },
    });

    // this.notification.pushEmployeeRegister(user.id, updateEmployeeRegister);
    // this.notification.pushEmployeeRegister(
    //   business.userInfo.id,
    //   updateEmployeeRegister,
    // );
    return;
  }
  async findAllBusinessEmployees(user: User) {
    const business = await this.business.findByUserId(user.id);

    if (!business) throw new NotFoundException('business not found');

    return this.employeeRepo.find({
      where: {
        business: {
          id: business.id,
        },
      },
      relations: {
        employeeRegisters: true,
        userInfo: true,
      },
    });
  }
  async findRegisterRequests(user: User, query: FindRegisterRequestsDto) {
    const where = await this.buildRegisterRequestWhere(user, query);

    const relations =
      user.role === Role.BUSINESS_ADMIN
        ? ['employee.userInfo']
        : ['business.userInfo'];

    return this.employeeRegisterRepo.find({
      where,
      relations,
    });
  }
  async findRegisterByBusinessId(
    businessId: string,
  ): Promise<EmployeeRegister | null> {
    const employeeRegister = await this.employeeRegisterRepo.findOne({
      where: { business: { id: businessId } },
    });

    return employeeRegister;
  }
  async findRegisterByUserId(userId: string): Promise<EmployeeRegister | null> {
    const employeeRegister = await this.employeeRegisterRepo.findOne({
      where: { employee: { userInfo: { id: userId } } }, // navigate through employee -> userInfo
      relations: ['employee', 'employee.userInfo', 'business'], // load needed relations
    });

    return employeeRegister;
  }
  async findRegisterByIdAndBusiness(
    employeeRegisterId: string,
    businessId: string,
  ): Promise<EmployeeRegister | null> {
    return this.employeeRegisterRepo.findOne({
      where: {
        id: employeeRegisterId,
        business: {
          id: businessId,
        },
      },
      relations: ['employee'],
    });
  }
  async findRegisterByEmployeeId(
    employeeId: string,
  ): Promise<EmployeeRegister | null> {
    return this.employeeRegisterRepo.findOne({
      where: {
        employee: {
          id: employeeId,
        },
      },
    });
  }
  // employee-register.service.ts
  async findRegisterByIdAndEmployeeId(
    employeeRegisterId: string,
    employeeId: string,
  ): Promise<EmployeeRegister | null> {
    return this.employeeRegisterRepo.findOne({
      where: {
        id: employeeRegisterId,
        employee: {
          id: employeeId,
        },
      },
      relations: ['business'],
    });
  }
  async findAll(user: User) {
    const business = await this.business.findByUserId(user.id);
    console.log('business', business);
    if (!business) throw NotFoundException;

    return this.employeeRepo.find();
  }
  async findByUser(user: User) {
    const result = await this.findOneByUserId(user.id);

    if (!result) throw NotFoundException;
    return result;
  }
  async findAllByBusinessUser(user: User) {
    const business = await this.business.findByUserId(user.id);

    if (!business) throw NotFoundException;

    return this.employeeRepo.find({
      where: {
        business: {
          id: business.id,
        },
        employeeRegisters: {
          status: EmployeeRegisterStatus.ACCEPTED,
        },
      },
      relations: {
        employeeRegisters: true,
        userInfo: true,
      },
    });
  }
  async findAllAcceptedBusinessEmployees(
    businessId: string,
  ): Promise<Employee[]> {
    return this.employeeRepo.find({
      where: {},
      relations: {
        employeeRegisters: true,
      },
    });
  }

  findOneByUserId(id: string) {
    return this.employeeRepo.findOne({
      where: {
        userInfo: {
          id: id,
        },
      },
    });
  }
  createByUserId(id: string) {
    return this.employeeRepo.insert({
      userInfo: {
        id: id,
      },
    });
  }

  updateEmployeeRegisterStatus(id: string, status: EmployeeRegisterStatus) {
    return this.employeeRegisterRepo.update(
      {
        id: id,
      },
      {
        status: status,
      },
    );
  }

  async deleteContract(employeeRegisterId: string, user: User) {
    if (user.role === Role.BUSINESS_ADMIN) {
      const business = await this.business.findByUserId(user.id);
      if (!business) throw new NotFoundException('Business not found');

      const employeeRegister = await this.findRegisterByIdAndBusiness(
        employeeRegisterId,
        business.id,
      );
      if (!employeeRegister) throw NotFoundException;

      await this.deleteEmployeeFromBusinessAndServices(
        employeeRegister.employee.id,
      );

      return await this.employeeRegisterRepo.remove(employeeRegister);
    }

    if (user.role === Role.EMPLOYEE) {
      const employee = await this.findOneByUserId(user.id);
      if (!employee) throw new NotFoundException('Employee not found');

      const employeeRegister = await this.findRegisterByEmployeeId(employee.id);

      if (!employeeRegister)
        throw new BadRequestException('Employee register not found');

      await this.deleteEmployeeFromBusinessAndServices(employee.id);

      return await this.employeeRegisterRepo.remove(employeeRegister);
    }
  }
  async deleteEmployeeFromBusinessAndServices(
    employeeId: string,
  ): Promise<void> {
    // 1️⃣ Remove all services linked to the employee
    await this.employeeRepo
      .createQueryBuilder('employee')
      .relation(Employee, 'services')
      .of(employeeId)
      .remove([]);

    // 2️⃣ Remove the employee from the business
    await this.employeeRepo
      .createQueryBuilder()
      .relation(Employee, 'business')
      .of(employeeId)
      .set(null);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: {
        userInfo: {
          profile: {
            phoneNumber: phoneNumber,
          },
        },
      },
      relations: ['userInfo.profile'],
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with phone number ${phoneNumber} not found`,
      );
    }

    return employee;
  }
}
