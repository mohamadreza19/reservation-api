import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AvailableTime } from '../available-time/entities/available-time.entity';
import { Business } from 'src/features/business/entities/business.entity';
import { Employee } from 'src/features/employee/entities/employee.entity';
import { Transaction } from 'src/features/transaction/entities/transaction.entity';
import { ServiceCategory } from 'src/features/service-category/entities/service-category.entity';

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
    (employee: Employee) => employee.serviceProfiles, // The serviceProfiles field in Employee
    { nullable: false, onDelete: 'CASCADE' }, // Ensure this is not nullable
  )
  employees: Employee[];

  @Column()
  deposit: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.serviceProfile)
  transactions: Transaction[];

  @OneToMany(
    () => AvailableTime,
    (availableTime: AvailableTime) => availableTime.serviceProfile,
  )
  availableTimes: AvailableTime[];

  @ManyToOne(() => Business, (business: Business) => business.serviceProfiles)
  business: Business;
}
