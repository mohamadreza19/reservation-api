import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { LoginDto } from 'src/auth/dto/login.dto';
import { Role } from 'src/common/enums/role.enum';
import { ProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { AddOtp, CreateUserDto } from './dto/user.dto';
import { lstatSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import {
  deleteFileFromDisk,
  saveFileToDisk,
} from 'src/common/utils/file-storage.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByPhoneNumber(
    phoneNumber: string,
    includePassword = false,
    includeOtp = false,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        profile: {
          phoneNumber: phoneNumber,
        },
      },
      relations: ['profile'],

      select: {
        id: true,
        profile: true,
        role: true,
        password: includePassword,
        otpCode: includeOtp,
        otpExpires: includeOtp,
      },
    });
  }
  async findByPhoneAndPass(dto: LoginDto) {
    return this.userRepository.findOne({
      where: {
        profile: {
          phoneNumber: dto.phoneNumber,
        },
        password: dto.password,
      },
      relations: ['profile'],
    });
  }
  create({ profile, role }: CreateUserDto) {
    // prob
    const user = this.userRepository.create({
      profile: profile,
      role,
    });
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(where?: FindOptionsWhere<User>) {
    return this.userRepository.findOne({ where });
  }

  updateRole(user: User, Role: Role) {
    user.role = Role;
  }
  addOtp(user: User, dto: AddOtp) {
    user.otpCode = dto.otpCode;
    user.otpExpires = dto.otpExpires;
  }
  clearOtp(user: User) {
    user.otpCode = null as any;
    user.otpExpires = null as any;
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
  save(user: User) {
    return this.userRepository.save(user);
  }

  async getProfile(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        password: false,
        otpCode: false,
        otpExpires: false,
      },
    });
  }
  async updateProfile(user: User, dto: UpdateProfileDto) {
    user.profile = dto as any;

    return this.userRepository.save(user);
  }
  async updateProfileImg(user: User, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not found');
    const DESTINATION = 'user-profile-imgs';

    const prevPath = user.profile.img;

    if (prevPath) {
      deleteFileFromDisk({
        filePath: prevPath,
      });
    }

    const result = saveFileToDisk({
      destination: DESTINATION,
      file: file,
    });
    user.profile.img = result.relativePath;
    const userResult = await this.userRepository.save(user);
    return userResult;
  }
  async deleteProfileImg(user: User) {
    const filePath = user.profile.img;
    if (!filePath) return;

    const isDeleted = deleteFileFromDisk({
      filePath: filePath,
    });

    if (!isDeleted) throw BadRequestException;

    return;
  }
}
