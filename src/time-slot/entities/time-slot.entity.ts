import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Business } from 'src/business/entities/business.entity';
import { TimeSlotStatus } from 'src/common/enums/time-slot-status.enum';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class Timeslot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Schedule, (schedule) => schedule, {
    onDelete: 'CASCADE',
  })
  schedule: Schedule;

  @ManyToOne(() => Business, (business) => business)
  business: Business;

  @Column()
  date: string;

  // @Column()
  // startTime: string;

  // @Column()
  // endTime: string;

  @Column({
    enum: TimeSlotStatus,
  })
  status: TimeSlotStatus;

  @OneToOne(() => Appointment, (appointment) => appointment.timeslot)
  appointment: Appointment;
}
