import { Business } from 'src/features/business/entities/business.entity';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

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
