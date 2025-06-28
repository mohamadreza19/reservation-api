import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/customer.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  createFromUser(user: User) {
    const instance = this.customerRepo.create({
      userInfo: user,
    });

    return this.customerRepo.save(instance);
  }

  createByUserId(userId: string) {
    return this.customerRepo.insert({
      userInfo: {
        id: userId,
      },
    });
  }
  create(createCustomerDto: CreateCustomerDto) {
    const instance = this.customerRepo.create(createCustomerDto);
    return this.customerRepo.save(instance);
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: string) {
    return this.customerRepo.findOne({
      where: {
        id,
      },
    });
  }
  findByUserId(userId: string) {
    return this.customerRepo.findOne({
      where: {
        userInfo: {
          id: userId,
        },
      },
      relations: ['userInfo'],
    });
  }
  update(id: number, updateCustomerDto: CreateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
