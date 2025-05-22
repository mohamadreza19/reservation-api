// service.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Price } from 'src/price/entities/price.entity';

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

  @OneToOne(() => Price, (price) => price.service, {
    nullable: true, // Allow null for system services
  })
  price: Price | null;
}
