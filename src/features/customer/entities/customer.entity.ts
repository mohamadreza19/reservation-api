import { Appointment } from 'src/features/appointment/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email: string;

  @Column()
  name: string;

  @OneToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.customer,
  )
  appointments: Appointment[];
  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.customer,
  )
  transactions: Transaction[];
}
