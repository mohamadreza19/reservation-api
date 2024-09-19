import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceCategory } from './service-category.entity';

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
}
