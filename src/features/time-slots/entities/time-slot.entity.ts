import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { TimeSlotStatus } from 'src/shared/types/time-slot-status.enum';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  HHMM: string;

  @Column()
  date: string; // YYYY-MM-DD

  @ManyToOne(() => Business, (business: Business) => business.timeSlots, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE, // Default status
  })
  status: TimeSlotStatus;
}
