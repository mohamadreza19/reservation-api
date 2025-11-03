import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from './entities/notification.entity';

import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { NotificationEvent } from 'src/common/enums/notification-event.enum';
import { NotificationFilterDto } from './dto/notification-filter.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly eventEmitter: EventEmitter2,
    private readonly user: UserService,
  ) {}

  // Push a new notification
  async push(userId: string, type: NotificationEvent, payload: any) {
    const notification = await this.notificationRepo.save({
      userInfo: { id: userId },
      payload: JSON.stringify(payload),
      isRead: false,
      type: type,
    });

    this.eventEmitter.emit(NotificationStatus.UN_READ, {
      userId,
      notification,
    });

    return notification;
  }

  // Fetch unread notifications
  async findUnreadByUserId(userId: string) {
    return this.notificationRepo.find({
      where: { userInfo: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  // Mark a notification as read
  async markAsRead(id: string, userId: string) {
    const noti = await this.notificationRepo.findOne({
      where: { id, userInfo: { id: userId } },
    });
    if (!noti) throw new NotFoundException();

    noti.isRead = true;
    await this.notificationRepo.save(noti);

    // this.eventEmitter.emit(NotificationStatus.READ, {
    //   userId,
    //   notification: noti,
    // });
    return noti;
  }

  async findUserNotifications(
    userId: string,
    // { isRead }: NotificationFilterDto,
  ) {
    return this.notificationRepo.find({
      where: {
        userInfo: {
          id: userId,
        },
        // isRead: isRead,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
  async markAllAsRead(userId: string) {
    return await this.notificationRepo.update(
      {
        userInfo: {
          id: userId,
        },
        isRead: false,
      },
      {
        isRead: true,
      },
    );
  }
}
