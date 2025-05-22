import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @ManyToOne(() => Business, (business) => business.employees)
  @JoinColumn()
  business: Business;

  @OneToMany(() => Appointment, (appointment) => appointment.employee)
  appointments: Appointment[];

  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  userInfo: User | null;
}
