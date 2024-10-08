import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  HHMM: string;

  @Column()
  date: string;

  @ManyToOne(() => Business, (business: Business) => business.timeSlots, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @Column({ default: false })
  available: boolean;
}
