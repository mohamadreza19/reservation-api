import { BusinessCategory } from 'src/features/business-category/entities/business-category.entity';
import { BusinessSchedule } from 'src/features/business-schedule/entities/business-schedule.entity';
import { Employee } from 'src/features/employee/entities/employee.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToOne(
    () => BusinessSchedule,
    (businessSchedule: BusinessSchedule) => businessSchedule,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  businessSchedule: BusinessSchedule;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.business,
  )
  serviceProfiles: ServiceProfile[];

  @OneToMany(() => Employee, (employee: Employee) => employee.business)
  employees: Employee[];
}
