import { Service } from 'src/service/entities/service.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  amount: number;

  @OneToOne(() => Service, (service) => service.price, {
    onDelete: 'CASCADE', // Delete price if service is deleted
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
