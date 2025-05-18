// reminder.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  remindAt: Date;

  @Column({ default: false })
  sent: boolean;

  @OneToOne(() => Appointment, (appointment) => appointment.reminder)
  appointment: Appointment;
}
