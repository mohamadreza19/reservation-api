// business.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { Service } from '../../service/entities/service.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Employee, (employee) => employee.business)
  employees: Employee[];

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];
}
