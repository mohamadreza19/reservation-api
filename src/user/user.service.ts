import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

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

  findOne(where?: FindOptionsWhere<User>) {
    return this.userRepository.findOne({ where });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async clearOTP(userId: string) {
    await this.userRepository.update(userId, {
      otpCode: null as any,
      otpExpires: null as any,
    });
  }
}
