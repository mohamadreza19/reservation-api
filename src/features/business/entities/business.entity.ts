import { BusinessCategory } from 'src/features/business-category/entities/business-category.entity';

import { Employee } from 'src/features/employee/entities/employee.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessSchedule } from '../business-schedule/entities/business-schedule.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  icon: string;

  @Column({
    nullable: true,
  })
  subDomainName: string;

  @ManyToOne(
    () => BusinessCategory,
    (businessCategory: BusinessCategory) => businessCategory.businesses,
  )
  businessCategory: BusinessCategory;

  @OneToOne(() => BusinessSchedule, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn() // This decorator tells TypeORM to create a foreign key in the Business table
  businessSchedule: BusinessSchedule;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.business,
  )
  serviceProfiles: ServiceProfile[];

  @OneToMany(() => Employee, (employee: Employee) => employee.business)
  employees: Employee[];
}
