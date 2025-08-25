// service.entity.ts
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import { Price } from 'src/price/entities/price.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Plan } from './plan.entity';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity()
@Tree('closure-table')
export class Service extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('int', { nullable: true })
  durationInMinutes: number;

  @Column({ default: false })
  isSystemService: boolean; // Marks constant/main services

  @Column({ nullable: true }) // Add icon field to store file path
  icon: string;

  @ManyToOne(() => Plan, (p) => p.service)
  plan: Plan;

  @ManyToOne(() => Business, (business) => business.services, {
    nullable: true, // Constant services won't belong to a business
  })
  business: Business | null;

  @TreeChildren()
  children: Service[];

  @ManyToOne(() => Service, (service) => service.children, {
    onDelete: 'CASCADE',
  })
  @TreeParent()
  parent: Service | null;

  @OneToOne(() => Price, (price) => price.service, {
    nullable: true, // Allow null for system services
    cascade: true,
  })
  price: Price | null;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointment: Appointment[];

  // @OneToMany(() => Timeslot, (timeslot) => timeslot.service)
  // timeslots: Timeslot[];

  @ManyToMany(() => Employee, (employees) => employees.services)
  employees: Employee[];
}
