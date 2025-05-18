// sub-service.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Service } from './service.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity()
export class SubService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  durationMinutes: number;

  @ManyToOne(() => Service, (service) => service.subServices)
  service: Service;

  @OneToMany(() => Appointment, (appointment) => appointment.subService)
  appointments: Appointment[];
}
