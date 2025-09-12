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
import { Service } from 'src/service/entities/service.entity';
import { Employee } from 'src/employee/entities/employee.entity';

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
  date: string; // // yyyy-mm-dd

  @ManyToOne(() => Service, (ser) => ser.timeslots)
  service: Service;

  @Column()
  tStart: string; // example '00:01:00'

  @Column()
  tEnd: string; // example '00:01:00'

  @Column({
    enum: TimeSlotStatus,
  })
  status: TimeSlotStatus;

  @OneToOne(() => Appointment, (appointment) => appointment.timeslot)
  appointment: Appointment;

  @ManyToOne(() => Employee, (e) => e.timeslots)
  employees: Employee[];
}
