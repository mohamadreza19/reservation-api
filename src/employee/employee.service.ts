import { Injectable, NotFoundException } from '@nestjs/common';

import { ServiceService } from 'src/service/service.service';
import { User } from 'src/user/entities/user.entity';
import {
  AddServiceDto,
  EmployeeRegisterDto,
  HireToBusinessDto,
} from './dto/employee.dto';
import { BusinessService } from 'src/business/business.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { EmployeeRegister } from './entities/employee-register.entity';
import { UserService } from 'src/user/user.service';
import { Business } from 'src/business/entities/business.entity';
import { NotificationService } from 'src/notification/notification.service';
import { EmployeeRegisterStatus } from 'src/common/enums/employee-register-status.enum';

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
  async addServices(user: User, addServiceDto: AddServiceDto) {
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
    let userToRegister: User | null;

    let employeeRegister: EmployeeRegister;

    business = await this.business.findByUserId(businessUser.id);

    if (!business) throw new NotFoundException('Business not found');

    userToRegister = await this.user.findByPhoneNumber(dto.phoneNumber);

    if (!userToRegister) throw new NotFoundException('user are not found');
    if (!userToRegister.isPhoneVerified)
      throw new NotFoundException('user phone is not is not verified');

    employeeRegister = (await this.employeeRegisterRepo.findOne({
      where: {
        business: {
          id: business.id,
        },
      },
    })) as EmployeeRegister;

    if (
      employeeRegister &&
      employeeRegister.status == EmployeeRegisterStatus.ACCEPTED
    ) {
      return 'employee already registered';
    }

    if (
      employeeRegister &&
      employeeRegister.status == EmployeeRegisterStatus.PENDING
    ) {
      return 'Already created and is still pending for user accept';
    }
    if (
      employeeRegister &&
      employeeRegister.status == EmployeeRegisterStatus.REJECTED
    ) {
      employeeRegister.status = EmployeeRegisterStatus.PENDING;

      this.employeeRegisterRepo.save(employeeRegister);
    }

    if (!employeeRegister) {
      const employeeRegisterInstance = this.employeeRegisterRepo.create({
        business: {
          id: business.id,
        },
        userInfo: {
          id: userToRegister.id,
        },
      });

      employeeRegister = await this.employeeRegisterRepo.save(
        employeeRegisterInstance,
      );
    }

    //   Business Notify
    await this.notification.pushEmployeeRegister(
      businessUser.id,
      employeeRegister,
    );
    //   User Notify
    await this.notification.pushEmployeeRegister(
      userToRegister.id,
      employeeRegister,
    );
  }
  async hireToBusiness(dto: HireToBusinessDto, user: User) {
    const employeeRegister = await this.employeeRegisterRepo.findOne({
      where: { id: dto.employeeRegisterId, userInfo: { id: user.id } },
      relations: ['business'],
    });
    const businessId = employeeRegister?.business.id;

    if (!businessId)
      throw new NotFoundException('Business of register request not found');

    const business = await this.business.findOne(businessId);

    if (!business)
      throw new NotFoundException('Business register request not found');

    if (!employeeRegister)
      throw new NotFoundException('Employee register request not found');

    const employeeInstance = this.employeeRepo.create({
      business: business,
      userInfo: user,
      employeeRegister: employeeRegister,
    });

    employeeRegister.status = EmployeeRegisterStatus.ACCEPTED;

    const updateEmployeeRegister =
      await this.employeeRegisterRepo.save(employeeRegister);

    const result = await this.employeeRepo.insert(employeeInstance);

    this.notification.pushEmployeeRegister(user.id, updateEmployeeRegister);
    this.notification.pushEmployeeRegister(
      business.userInfo.id,
      updateEmployeeRegister,
    );

    return result;
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
      relations: ['userInfo', 'employeeRegister'],
    });
  }

  findAll() {
    return `This action returns all employee`;
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

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
