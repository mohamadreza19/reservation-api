import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../../entities/business.entity';

@Entity()
export class BusinessSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true })
  holidays: number[];

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  timeInterval: number; // Interval in minutes

  @OneToOne(() => Business)
  business: Business;
}
