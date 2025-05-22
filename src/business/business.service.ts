import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/common/enums/role.enum';

// business.service.ts
@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepo: Repository<Business>,
    private userService: UserService,
  ) {}

  async create(dto: CreateBusinessDto, user: User): Promise<Business> {
    if (user.role == Role.CUSTOMER) {
      const business = this.businessRepo.create({
        address: dto.address,
        userInfo: user,
      });

      const result = await this.businessRepo.save(business);
      this.userService.updateRole(user.id, Role.BUSINESS_ADMIN);

      return result;
    }

    throw new BadRequestException();
  }

  async update(dto: UpdateBusinessDto, user: User): Promise<Business> {
    const business = await this.findByUserId(user.id);

    await this.businessRepo.update(business.id, dto);
    return this.findOne(business.id);
  }

  async findAll(filter?: { address?: string }): Promise<Business[]> {
    const qb = this.businessRepo.createQueryBuilder('business');

    if (filter?.address) {
      qb.where('business.address ILIKE :address', {
        address: `%${filter.address}%`,
      });
    }

    return qb
      .leftJoinAndSelect('business.userInfo', 'user')
      .leftJoinAndSelect('business.employees', 'employee')
      .leftJoinAndSelect('business.services', 'service')
      .getMany();
  }

  async findOne(id: string): Promise<any> {
    const result = this.businessRepo.findOne({
      where: { id },
      relations: ['userInfo', 'employees', 'services'],
    });
    if (!result) {
      throw 'lala';
    }

    return result;
  }
  async findByUserId(userId: string): Promise<Business> {
    const business = await this.businessRepo.findOne({
      where: { userInfo: { id: userId } },
      relations: ['userInfo'],
    });

    if (!business) {
      throw new NotFoundException('Business not found for this user');
    }

    return business;
  }
}
