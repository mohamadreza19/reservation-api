import { Business } from 'src/features/business/entities/business.entity';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import { TimeSlot } from 'src/features/time-slots/entities/time-slot.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TimeSlot)
  @JoinColumn()
  timeSlot: TimeSlot;

  @ManyToOne(() => Business, (business: Business) => business, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  business: Business;

  @ManyToOne(() => Customer, (customer: Customer) => customer.appointments, {
    nullable: false,
  })
  customer: Customer;

  @ManyToOne(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile,
    {
      nullable: false,
    },
  )
  serviceProfile: ServiceProfile;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled'; // Status of the appointment

  @Column({ type: 'enum', enum: ['paid', 'unpaid'], default: 'unpaid' })
  paymentStatus: 'paid' | 'unpaid'; // Payment status
}
