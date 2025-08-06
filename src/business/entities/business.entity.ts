// business.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Appointment } from 'src/appointment/entities/appointment.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';
import { User } from 'src/user/entities/user.entity';
import { Service } from '../../service/entities/service.entity';

@Entity()
export class Business extends SharedColumn {
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

  // @OneToMany(() => Employee, (employee) => employee.business)
  // employees: Employee[];

  @OneToMany(() => Timeslot, (timeslot) => timeslot.business)
  timeslots: Timeslot[];

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @OneToMany(() => Appointment, (appo) => appo.business)
  appointments: Appointment[];

  // @ManyToMany(() => Customer, (customer) => customer.businesses)
  // customers: Customer[];
}
