// service.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { SubService } from './sub-service.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Business, (business) => business.services)
  business: Business;

  @OneToMany(() => SubService, (subService) => subService.service)
  subServices: SubService[];
}
