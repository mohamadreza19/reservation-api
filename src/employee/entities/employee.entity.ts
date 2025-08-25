import { Business } from 'src/business/entities/business.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeRegister } from './employee-register.entity';
import { SharedColumn } from 'src/common/models/shared-columns';

@Entity()
export class Employee extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn()
  userInfo: User;

  @ManyToOne(() => Business, (business: Business) => business.employees)
  business: Business;

  @ManyToMany(() => Service, (services) => services.employees)
  services: Service[];

  @OneToOne(() => EmployeeRegister, (re) => re.employee)
  @JoinColumn()
  employeeRegister: EmployeeRegister;
}
