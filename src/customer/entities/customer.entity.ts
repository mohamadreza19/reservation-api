// customer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { SharedColumn } from 'src/common/models/shared-columns';

@Entity()
export class Customer extends SharedColumn {
  @ApiProperty({ example: 'uuid-value' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: () => CreateUserDto,
    description: 'User info associated with the customer',
  })
  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn()
  userInfo: User;

  @OneToMany(() => Appointment, (appointment) => appointment.customer)
  appointments: Appointment[];

  // @ManyToMany(() => Business, (business) => business.customers)
  // businesses: Business[];
}
