import { ApiProperty } from '@nestjs/swagger';
import { Service } from 'src/service/entities/service.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Price {
  @ApiProperty({
    description: 'Unique identifier for the price',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Price',
    type: 'string',
  })
  @Column()
  amount: string;

  @OneToOne(() => Service, (service) => service.price, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service: Service;
}
