import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import { Customer } from 'src/features/customer/entities/customer.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentMethod: string;

  @Column({ default: 'pending' })
  status: string;

  @Column('timestamp')
  transactionDate: Date;

  // Many-to-one relationship with ServiceProfile
  @ManyToOne(
    () => ServiceProfile,
    (serviceProfile) => serviceProfile.transactions,
    { nullable: false, onDelete: 'CASCADE' },
  )
  serviceProfile: ServiceProfile;

  // Many-to-one relationship with User (if applicable)
  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    nullable: false,
  })
  customer: Customer; // Optional: Tracks the user who made the transaction
}
