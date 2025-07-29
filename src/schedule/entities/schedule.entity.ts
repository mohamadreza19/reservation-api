import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Business } from 'src/business/entities/business.entity';
import { Day } from 'src/common/enums/day.enum';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';
import { SharedColumn } from 'src/common/models/shared-columns';

@Entity()
export class Schedule extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, { nullable: false })
  business: Business;

  @Column({ type: 'enum', enum: Day })
  day: Day;

  @Column({ type: 'time', nullable: true })
  startTime: string | null;

  @Column({ type: 'time', nullable: true })
  endTime: string | null;

  @Column({ type: 'time', nullable: true })
  interval: string;

  @Column({ type: 'boolean', default: false })
  isOpen: boolean;

  @OneToMany(() => Timeslot, (timeslot) => timeslot.startTime)
  timeslots: Timeslot[];
}
