import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Appointment } from 'src/features/appointment/entities/appointment.entity';
import { Business } from 'src/features/business/entities/business.entity';
import { Employee } from 'src/features/employee/entities/employee.entity';
import { ServiceCategory } from 'src/features/service-category/entities/service-category.entity';
import { Transaction } from 'src/features/transaction/entities/transaction.entity';

@Entity()
export class ServiceProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ServiceCategory,
    (serviceCategory: ServiceCategory) => serviceCategory.serviceProfiles,
  )
  serviceCategory: ServiceCategory;

  @Column()
  name: string;

  @ManyToMany(
    () => Employee, // The Employee entity
    (employee: Employee) => employee.serviceProfiles,
    {}, // The serviceProfiles field in Employee
  )
  @JoinTable()
  employees: Employee[];

  @Column()
  deposit: number;

  @OneToMany(() => Transaction, (transaction) => transaction.serviceProfile)
  transactions: Transaction[];

  @ManyToOne(() => Business, (business: Business) => business.serviceProfiles)
  business: Business;

  @OneToMany(() => Appointment, (appointment) => appointment.serviceProfile)
  appointments: Appointment[];
}
