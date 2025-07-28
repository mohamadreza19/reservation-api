import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  color: string;

  @OneToOne(() => Service, (service) => service.plan)
  service: Service;

  @ApiProperty()
  @Column({ default: 1 })
  order: number;
}
