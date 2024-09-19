import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessCategory } from './business-category.entity';

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
}
