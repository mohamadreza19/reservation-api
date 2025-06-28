import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Role } from '../../common/enums/role.enum';
import { Employee } from '../../employee/entities/employee.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  // Business relationship (for employees)
  @OneToOne(() => Business, (business) => business.userInfo, {
    nullable: true,
  })
  business: Business | null;

  @OneToOne(() => Customer, (customer) => customer.userInfo, {
    nullable: true,
  })
  customer: Customer | null;

  // user.entity.ts
  @Column({ nullable: true, select: false })
  otpCode: string;

  @Column({ nullable: true })
  otpExpires: Date;
  @Column({ default: true })
  isNew: boolean;

  @Column({ nullable: true })
  avatarPath: string;
}
