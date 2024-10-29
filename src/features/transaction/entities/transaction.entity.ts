import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import { Customer } from 'src/features/customer/entities/customer.entity';
import { TransactionStatus } from 'src/shared/types/transaction-status.enum';
import { Business } from 'src/features/business/entities/business.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  paymentMethod: string;

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
    nullable: true,
  })
  customer: Customer | null; // Optional: Tracks the user who made the transaction

  @ManyToOne(() => Business, (business) => business.transactions, {
    nullable: true,
  })
  business: Business | null;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;
}
