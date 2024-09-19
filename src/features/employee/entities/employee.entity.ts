import { Business } from 'src/features/business/entities/business.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';

import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumnCannotBeNullableError,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business: Business) => business.employees)
  master: Business;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.employee,
  )
  serviceProfiles: ServiceProfile[];
}
