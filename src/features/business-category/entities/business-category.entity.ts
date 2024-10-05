import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceCategory } from '../../service-category/entities/service-category.entity';

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
