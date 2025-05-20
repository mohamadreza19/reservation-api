// employee.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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

  @Column({ nullable: true })
  specialization: string;

  @ManyToOne(() => Business, (business) => business.employees)
  @JoinColumn()
  business: Business;

  @OneToMany(() => Appointment, (appointment) => appointment.employee)
  appointments: Appointment[];

  // Link to the authentication system
  @ManyToOne(() => User, (user) => user.employee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
