import { BusinessCategory } from 'src/features/business-category/entities/business-category.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ServiceCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    () => BusinessCategory,
    (businessCategory: BusinessCategory) => businessCategory.serviceCategory,
  )
  businessCategory: BusinessCategory;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.serviceCategory,
  )
  serviceProfiles: ServiceProfile;
}
