import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../../entities/business.entity';

@Entity()
export class BusinessSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true, default: [6] })
  holidays: number[]; //  [0,..,6]

  @Column({ type: 'time', nullable: false, default: '09:00' }) // hh:mm
  startHour: string;

  @Column({ type: 'time', nullable: false, default: '17:00' }) //  hh:mm
  endHour: string;

  @Column({ type: 'int', nullable: false, default: 30 })
  timeInterval: number; // Interval in minutes

  @OneToOne(() => Business, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
