// service.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  Tree,
  TreeParent,
  TreeChildren,
  JoinColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Price } from 'src/price/entities/price.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Plan } from './plan.entity';

@Entity()
@Tree('closure-table')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isSystemService: boolean; // Marks constant/main services

  @Column({ nullable: true }) // Add icon field to store file path
  icon: string;

  @OneToOne(() => Plan, (p) => p.service)
  @JoinColumn()
  plan: Plan;

  @ManyToOne(() => Business, (business) => business.services, {
    nullable: true, // Constant services won't belong to a business
  })
  business: Business | null;

  @TreeChildren()
  children: Service[];

  @ManyToOne(() => Service, (service) => service.children, {
    onDelete: 'CASCADE',
  })
  @TreeParent()
  parent: Service | null;

  @OneToOne(() => Price, (price) => price.service, {
    nullable: true, // Allow null for system services
    cascade: true,
  })
  price: Price | null;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointment: Appointment[];
}
