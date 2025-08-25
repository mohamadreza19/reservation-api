import { SharedColumn } from 'src/common/models/shared-columns';
import { EmployeeRegister } from 'src/employee/entities/employee-register.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => EmployeeRegister, (er) => er.notifications, {
    nullable: true,
  })
  employeeRegister: EmployeeRegister;
}
