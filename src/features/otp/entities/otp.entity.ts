import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Index() // Create an index on expiresAt
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
