import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gateway: NotificationGateway,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}
  async push(userId: string, payload: string) {
    await this.notificationRepo.insert({
      userInfo: {
        id: userId,
      },
      payload: payload,
    });

    return this.gateway.sendToUser(userId, payload);
  }

  async findUserNotifications(user: User) {
    return await this.notificationRepo.find({
      where: {
        userInfo: {
          id: user.id,
        },
      },
    });
  }
  async updateOneStatus(id: string, user: User) {
    const noti = await this.notificationRepo.findOne({
      where: {
        id,
        userInfo: {
          id: user.id,
        },
      },
    });

    if (!noti) throw NotFoundException;

    if (noti.status === NotificationStatus.READ) return;

    noti.status = NotificationStatus.READ;

    return this.notificationRepo.save(noti);
  }
  async updateAllStatuses(dto: UpdateNotificationDto, user: User) {
    try {
      const { ids } = dto;

      await this.notificationRepo.update(
        {
          id: In(ids),
          userInfo: {
            id: user.id,
          },
        },
        { status: NotificationStatus.READ },
      );

      return { message: 'Statuses updated successfully' };
    } catch (error) {
      throw new Error(`Failed to update statuses: ${error.message}`);
    }
  }
}
