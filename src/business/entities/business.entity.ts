// business.entity.ts
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Appointment } from 'src/appointment/entities/appointment.entity';
import { BusinessService } from 'src/business-service/entities/business-service.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import { EmployeeRegister } from 'src/employee/entities/employee-register.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';
import { User } from 'src/user/entities/user.entity';
import { BProfile } from './b-profile.entity';
import { BusinessServicePrice } from 'src/business-service/entities/business-service-price.entity';

@Entity()
export class Business extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => BProfile, (bp) => bp.business, { cascade: true, eager: true })
  @JoinColumn()
  bProfile: BProfile;

  @OneToOne(() => User, (user) => user.business)
  @JoinColumn()
  userInfo: User;

  @OneToMany(() => Timeslot, (timeslot) => timeslot.business)
  timeslots: Timeslot[];

  @OneToMany(() => Appointment, (appo) => appo.business)
  appointments: Appointment[];

  @OneToMany(() => Employee, (employees) => employees.business)
  employees: Employee[];

  @OneToMany(
    () => EmployeeRegister,
    (employeeRegister) => employeeRegister.business,
  )
  employeeRegisters: EmployeeRegister[];

  @OneToMany(() => BusinessService, (bs: BusinessService) => bs.business)
  businessServices: BusinessService[];

  @OneToMany(
    () => BusinessServicePrice,
    (bsPrice: BusinessServicePrice) => bsPrice.business,
  )
  businessServicesPrices: BusinessServicePrice[];
}
