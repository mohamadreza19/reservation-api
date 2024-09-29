import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceCategory } from '../../service-category/entities/service-category.entity';
import { Business } from 'src/features/business/entities/business.entity';

@Entity()
export class BusinessCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => ServiceCategory,
    (serviceCategory: ServiceCategory) => serviceCategory.businessCategory,
  )
  serviceCategory: ServiceCategory[];

  @OneToMany(() => Business, (business: Business) => business.businessCategory)
  businesses: Business[];
}
