import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { SharedColumn } from 'src/common/models/shared-columns';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  userInfo: User;

  @Column({ nullable: true })
  payload: string;

  @Column({ default: NotificationStatus.UN_READ, enum: NotificationStatus })
  status: NotificationStatus;
}
