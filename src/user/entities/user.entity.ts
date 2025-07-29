import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from 'src/business/entities/business.entity';
import { Role } from 'src/common/enums/role.enum';

import { SharedColumn } from 'src/common/models/shared-columns';
import { Customer } from 'src/customer/entities/customer.entity';

@Entity()
export class User extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @OneToOne(() => Business, (business) => business.userInfo, {
    nullable: true,
  })
  business: Business | null;

  @OneToOne(() => Customer, (customer) => customer.userInfo, {
    nullable: true,
  })
  customer: Customer | null;

  // user.entity.ts
  @Column({ nullable: true, select: false })
  otpCode: string;

  @Column({ nullable: true })
  otpExpires: Date;
  @Column({ default: true })
  isNew: boolean;
}
