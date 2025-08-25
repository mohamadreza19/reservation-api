import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRegister } from 'src/employee/entities/employee-register.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gateway: NotificationGateway,

    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}
  async pushEmployeeRegister(
    userId: string,
    employeeRegister: EmployeeRegister,
  ) {
    await this.notificationRepo.insert({
      user: {
        id: userId,
      },
      employeeRegister: { id: employeeRegister.id },
    });

    return this.gateway.sendToUser(userId, employeeRegister);
  }
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  getAllUserNotifications(user: User) {
    return this.notificationRepo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.employeeRegister', 'employeeRegister') // inner join excludes null
      .where('notification.userId = :userId', { userId: user.id })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }
  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
