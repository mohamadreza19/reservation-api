import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SharedColumn } from 'src/common/models/shared-columns';
@Entity()
export class Plan extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  color: string;

  @OneToMany(() => Service, (service) => service.plan)
  service: Service;

  @ApiProperty()
  @Column({ default: 1 })
  order: number;
}
