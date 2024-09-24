import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}
  async generateOtp(userId: number): Promise<Otp> {
    const otpCode = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP code
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    const otp = this.otpRepository.create({
      code: otpCode,
      userId,
      expiresAt,
      isUsed: false,
    });
    return this.otpRepository.save(otp);
  }

  // Verify if the OTP is valid
  async verifyOtp(userId: number, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        userId,
        code,
        expiresAt: MoreThan(new Date()), // Ensure the OTP has not expired
      },
    });

    return !!otp; // Return true if OTP is found and still valid
  }

  @Cron('0 * * * *')
  async deleteExpiredOtps() {
    await this.otpRepository.delete({ expiresAt: LessThan(new Date()) });
    console.log('Deleted expired OTPs');
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
