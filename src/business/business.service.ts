import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  CreateBusinessDto,
  PublicBusinessDto,
  UpdateBusinessDto,
} from './dto/business.dto';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/common/enums/role.enum';
import shortid, { generate } from 'shortid';
import { isUUID } from 'class-validator';

// business.service.ts
@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepo: Repository<Business>,
    private userService: UserService,
  ) {}

  async create(user: User): Promise<Business> {
    const business = this.businessRepo.create({
      name: generate(),
      userInfo: user,
    });

    const result = await this.businessRepo.save(business);
    this.userService.update(user.id, { role: Role.BUSINESS_ADMIN });

    return result;
  }

  async update(dto: UpdateBusinessDto, user: User) {
    const business = await this.findByUserId(user.id);
    if (business) {
      await this.businessRepo.update(business.id, dto);
      return this.findOne(business.id);
    }
  }

  async findAll(filter?: { address?: string }): Promise<Business[]> {
    const qb = this.businessRepo.createQueryBuilder('business');

    if (filter?.address) {
      qb.where('business.address ILIKE :address', {
        address: `%${filter.address}%`,
      });
    }

    return (
      qb
        .leftJoinAndSelect('business.userInfo', 'user')
        // .leftJoinAndSelect('business.employees', 'employee')
        .leftJoinAndSelect('business.services', 'service')
        .getMany()
    );
  }

  async findOne(id: string) {
    const result = this.businessRepo.findOne({
      where: { id },
      relations: ['userInfo'],
    });

    return result;
  }
  async getBusinessProfileByUserId(userId: string): Promise<Business> {
    const business = await this.businessRepo.findOne({
      where: { userInfo: { id: userId } },
      relations: ['userInfo'],
    });

    if (!business) {
      throw new NotFoundException('Business not found for this user');
    }

    return business;
  }
  async findByUserId(userId: string): Promise<Business | null> {
    const business = await this.businessRepo.findOne({
      where: { userInfo: { id: userId } },
      relations: ['userInfo'],
    });

    return business;
  }
  async getBusinessLink(user: User) {
    const business = await this.findByUserId(user.id);
    const base = process.env.CUSTOMER_URL;
    if (business) {
      return `${base}?businessId=${business.id}`;
    }
  }
  async findPublicProfile(id: string): Promise<PublicBusinessDto> {
    if (!isUUID(id)) throw BadRequestException;
    const business = await this.businessRepo.findOne({
      where: { id },
      select: ['id', 'name', 'address'], // Select only public fields
    });
    console.log(id);
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return {
      id: business.id,
      name: business.name,
      address: business.address,
    };
  }
}
