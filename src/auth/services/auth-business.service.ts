import { Injectable } from '@nestjs/common';
import { BusinessService } from 'src/business/business.service';
import { Business } from 'src/business/entities/business.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthBusinessService {
  constructor(private readonly businessService: BusinessService) {}

  async ensureBusinessForUser(user: User): Promise<Business> {
    let business = await this.businessService.findByUserId(user.id);

    if (business) return business;

    return await this.businessService.create(user);
  }
}
