import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
  async updateOrCreateOTP(phoneNumber: string, otp: string, expires: Date) {
    let user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      // Create a temporary unverified user for OTP
      user = this.userRepository.create({
        phoneNumber,
        role: Role.CUSTOMER,
        isVerified: false,
      });
    }

    user.otpCode = otp;
    user.otpExpires = expires;

    return this.userRepository.save(user);
  }

  async clearOTP(userId: string) {
    await this.userRepository.update(userId, {
      otpCode: null as any,
      otpExpires: null as any,
    });
  }
}
