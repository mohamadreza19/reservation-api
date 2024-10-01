import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
