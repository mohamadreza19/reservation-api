// customer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Business } from 'src/business/entities/business.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Appointment, (appointment) => appointment.customer)
  appointments: Appointment[];

  @ManyToMany(() => Business, (business) => business.customers)
  businesses: Business[];
}
