import { Business } from 'src/business/entities/business.entity';
import { EmployeeRegisterStatus } from 'src/common/enums/employee-register-status.enum';
import { Notification } from 'src/notification/entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class EmployeeRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Employee, (user) => user.employeeRegister)
  employee: Employee;

  @ManyToOne(() => User, (user) => user.employeeRegisters)
  userInfo: User;

  @ManyToOne(() => Business, (business) => business.employeeRegisters)
  business: Business;

  @Column({
    enum: EmployeeRegisterStatus,
    default: EmployeeRegisterStatus.PENDING,
  })
  status: EmployeeRegisterStatus;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Notification, (un) => un.employeeRegister)
  notifications: Notification[];
}
