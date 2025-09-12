import { Business } from 'src/business/entities/business.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeRegister } from './employee-register.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';

@Entity()
export class Employee extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn()
  userInfo: User;

  @ManyToOne(() => Business, (business: Business) => business.employees)
  business: Business;

  // @ManyToMany(() => Service, (services) => services.employees)
  // @JoinTable()
  // services: Service[];

  @OneToMany(() => EmployeeRegister, (er) => er.employee)
  employeeRegisters: EmployeeRegister[];
  @OneToMany(() => Timeslot, (t) => t.employees)
  timeslots: Timeslot[];
}
