import { BusinessCategory } from 'src/features/business-category/entities/business-category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
