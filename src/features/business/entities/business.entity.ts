import { Employee } from 'src/features/employee/entities/employee.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';

import { Appointment } from 'src/features/appointment/entities/appointment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessSchedule } from '../business-schedule/entities/business-schedule.entity';
import { TimeSlot } from '../../time-slots/entities/time-slot.entity';
import { Transaction } from 'src/features/transaction/entities/transaction.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  icon: string;

  @Column({
    nullable: true,
  })
  subDomainName: string;

  @Column({
    nullable: true,
  })
  businessCategoryId: number;

  @OneToOne(() => BusinessSchedule, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  @JoinColumn() // This decorator tells TypeORM to create a foreign key in the Business table
  businessSchedule: BusinessSchedule;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.business,
  )
  serviceProfiles: ServiceProfile[];

  @OneToMany(() => Employee, (employee: Employee) => employee.business)
  employees: Employee[];

  @OneToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.business,
  )
  appointments: Appointment[];

  @OneToMany(() => TimeSlot, (timeSlot: TimeSlot) => timeSlot.business)
  timeSlots: TimeSlot[];

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.business,
  )
  transactions: Transaction[];
}
