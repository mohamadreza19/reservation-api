import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private feedbackRepo: Repository<Feedback>,
    private user: UserService,
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto, authUser: User) {
    if (createFeedbackDto.userId !== authUser.id) {
      throw BadRequestException;
    }
    const user = await this.user.findOne({ id: createFeedbackDto.userId });
    if (!user) throw BadRequestException;
    return this.feedbackRepo.insert({
      user: { id: user.id },
      message: createFeedbackDto.message,
    });
  }

  findAll() {
    return this.feedbackRepo.find({
      select: {
        user: {
          userName: true,
          role: true,
          phoneNumber: true,
        },
      },
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
