import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthCustomerService {
  constructor(private readonly customerService: CustomerService) {}

  async ensureCustomerForUser(user: User): Promise<Customer> {
    let customer = await this.customerService.findByUserId(user.id);

    if (customer) return customer;

    return await this.customerService.create({ userInfo: user });
  }
}
