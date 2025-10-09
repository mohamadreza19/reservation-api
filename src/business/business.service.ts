import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UpdateBusinessProfileDto } from './dto/profile.dto';
import { Business } from './entities/business.entity';
import { BusinessLinkDto } from './dto/business.dto';

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
      bProfile: {
        name: user.profile.phoneNumber,
      },
      userInfo: user,
    });

    const result = await this.businessRepo.save(business);
    this.userService.updateRole(user, Role.BUSINESS_ADMIN);

    await this.userService.save(user);

    return result;
  }

  async updateProfile(
    user: User,
    dto: UpdateBusinessProfileDto,
  ): Promise<Business> {
    // 1️⃣ Find the business by user
    const business = await this.findByUserId(user.id);
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    // Merge new values into existing profile
    business.bProfile = {
      ...business.bProfile,
      ...dto,
    };

    return this.businessRepo.save(business);
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
  async findPublicProfile(id: string) {
    const result = await this.businessRepo.findOne({
      where: {
        id,
      },
    });

    if (!result) throw NotFoundException;
    return result.bProfile;
  }
  async findOneById(id: string) {
    const result = this.businessRepo.findOne({
      where: { id },
      relations: {
        bProfile: true,
        userInfo: true,
      },
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
  async getBusinessLink(user: User): Promise<BusinessLinkDto> {
    const business = await this.findByUserId(user.id);
    const base = process.env.CUSTOMER_URL;

    if (!business) throw NotFoundException;
    return {
      url: `${base}?businessId=${business.id}`,
    };
  }
  // async findPublicProfile(id: string): Promise<PublicBusinessDto> {
  //   if (!isUUID(id)) throw BadRequestException;
  //   const business = await this.businessRepo.findOne({
  //     where: { id },
  //     select: ['id', 'profile'], // Select only public fields
  //   });

  //   if (!business) {
  //     throw new NotFoundException('Business not found');
  //   }

  //   return {
  //     id: business.id,
  //     name: business.name,
  //     address: business.address,
  //   };
  // }
}
