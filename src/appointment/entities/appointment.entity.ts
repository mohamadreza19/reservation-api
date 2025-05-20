// appointment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Employee } from '../../employee/entities/employee.entity';

import { Reminder } from '../../reminder/entities/reminder.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  startTime: Date;

  @Column('timestamptz')
  endTime: Date;

  @ManyToOne(() => Customer, (customer) => customer.appointments)
  customer: Customer;

  @ManyToOne(() => Employee, (employee) => employee.appointments)
  employee: Employee;

  @OneToOne(() => Reminder, (reminder) => reminder.appointment, {
    cascade: true,
  })
  @JoinColumn()
  reminder: Reminder;
}
