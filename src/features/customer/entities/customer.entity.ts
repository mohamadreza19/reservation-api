import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  name: string;

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.customer,
  )
  transactions: Transaction[];
}
