import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

import { Role } from 'src/common/enums/role.enum';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByPhoneNumber(
    phoneNumber: string,
    includePassword = false,
    includeOtp = false,
  ): Promise<User | null> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.phoneNumber = :phoneNumber', { phoneNumber });

    if (includePassword) {
      query.addSelect('user.password'); // Explicitly include password if needed
    }

    if (includeOtp) {
      query.addSelect('user.otpCode'); // Explicitly include OTP code if needed
    }

    return await query.getOne();
  }
  async findByPhoneAndPass(dto: LoginDto) {
    return this.userRepository.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
        password: dto.password,
      },
    });
  }
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: string, updateUserDto: Partial<CreateUserDto>) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async updateRole(id: string, role: Role) {
    await this.userRepository.update(id, {
      role,
    });
  }

  async _create(user: User) {
    return this.userRepository.save;
  }
  updateUserInstance(user: User) {
    return this.userRepository.save(user);
  }

  async clearOTP(userId: string) {
    await this.userRepository.update(userId, {
      otpCode: null as any,
      otpExpires: null as any,
    });
  }
}
