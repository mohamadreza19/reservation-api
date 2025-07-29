// appointment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

import { Service } from 'src/service/entities/service.entity';
import { Timeslot } from 'src/time-slot/entities/time-slot.entity';
import { Business } from 'src/business/entities/business.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceDto } from 'src/service/dto/service.dto';
import { TimeslotByDateDto } from 'src/time-slot/dto/time-slot-dto';
import { BusinessProfileDto } from 'src/business/dto/business.dto';
import { AppointmentStatus } from '../constants/const';
import { SharedColumn } from 'src/common/models/shared-columns';

@Entity()
export class Appointment extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: () => Customer,
  })
  @ManyToOne(() => Customer, (customer) => customer.appointments)
  customer: Customer;

  @ApiProperty({
    type: () => ServiceDto,
  })
  @ManyToOne(() => Service, (service) => service.appointment, {
    onDelete: 'CASCADE',
    // cascade: true,
  })
  service: Service;

  @ApiProperty({
    type: () => TimeslotByDateDto,
  })
  @OneToOne(() => Timeslot, (timeslot) => timeslot.appointment)
  @JoinColumn()
  timeslot: Timeslot;

  @ApiProperty({
    type: () => BusinessProfileDto,
  })
  @ManyToOne(() => Business, (customer) => customer.appointments)
  business: Business;

  @Column({
    enum: AppointmentStatus,
    default: AppointmentStatus.InProcess,
  })
  status: AppointmentStatus;
}
