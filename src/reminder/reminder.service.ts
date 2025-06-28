import { Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderRedisService } from 'src/redis/services/reminder-redis.service';

@Injectable()
export class ReminderService {
  constructor() {}
  create(createReminderDto: CreateReminderDto) {
    // this.reminderRedisService.set('test', 'lala');
    return 'This action adds a new reminder';
  }

  findAll() {
    // return this.reminderRedisService.get('test');
    return `This action returns all reminder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reminder`;
  }

  update(id: number, updateReminderDto: UpdateReminderDto) {
    return `This action updates a #${id} reminder`;
  }

  remove(id: number) {
    // return this.reminderRedisService.del('test');
  }
}
