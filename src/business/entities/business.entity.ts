// business.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { Service } from '../../service/entities/service.entity';
import { User } from 'src/user/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  logoPath: string;

  @OneToOne(() => User, (user) => user.business)
  @JoinColumn()
  userInfo: User;

  @OneToMany(() => Employee, (employee) => employee.business)
  employees: Employee[];

  @OneToMany(() => Timeslot, (timeslot) => timeslot.business)
  timeslots: Timeslot[];

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @OneToMany(() => Appointment, (appo) => appo.business)
  appointments: Appointment[];

  // @ManyToMany(() => Customer, (customer) => customer.businesses)
  // customers: Customer[];
}
