import { Business } from 'src/business/entities/business.entity';
import { EmployeeRegisterStatus } from 'src/common/enums/employee-register-status.enum';
import { SharedColumn } from 'src/common/models/shared-columns';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class EmployeeRegister extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, (em) => em.employeeRegisters)
  employee: Employee;

  @ManyToOne(() => Business, (business) => business.employeeRegisters)
  business: Business;

  @Column({
    enum: EmployeeRegisterStatus,
    default: EmployeeRegisterStatus.PENDING,
  })
  status: EmployeeRegisterStatus;

  @Column({ nullable: true })
  description: string;
}
