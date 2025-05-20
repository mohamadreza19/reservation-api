// service.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isSystemService: boolean; // Marks constant/main services

  @ManyToOne(() => Business, (business) => business.services, {
    nullable: true, // Constant services won't belong to a business
  })
  business: Business | null;

  @OneToMany(() => Service, (service) => service.parent)
  children: Service[];

  @ManyToOne(() => Service, (service) => service.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Service | null;

  @Column({ nullable: true, name: 'parent_id' })
  parentId: string | null;
}
