import { Business } from 'src/business/entities/business.entity';
import { Role } from 'src/common/enums/role.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SharedColumn } from 'src/common/models/shared-columns';
import { Customer } from 'src/customer/entities/customer.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Profile } from './profile.entity';

@Entity()
export class User extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  profile: Profile;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToOne(() => Business, (business) => business.userInfo, {
    nullable: true,
  })
  business: Business | null;

  @OneToOne(() => Customer, (customer) => customer.userInfo, {
    nullable: true,
  })
  customer: Customer | null;

  @Column({ nullable: true, select: false })
  otpCode: string;

  @Column({ nullable: true })
  otpExpires: Date;

  @Column({ default: true })
  isNew: boolean;

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToOne(() => Employee, (employee) => employee.userInfo)
  employee: Employee;

  @OneToMany(() => Notification, (notifications) => notifications.userInfo)
  notifications: Notification[];
}
