import { Business } from 'src/features/business/entities/business.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';

import {
  Column,
  Entity,
  ManyToMany,
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

  @ManyToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.employees,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
    },
  )
  serviceProfiles: ServiceProfile[];

  @Column()
  name: string;
}
