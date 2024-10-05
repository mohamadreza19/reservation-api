import { Business } from 'src/features/business/entities/business.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business: Business) => business.employees, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.employees,
  )
  serviceProfiles: ServiceProfile[];

  @Column()
  name: string;
}
