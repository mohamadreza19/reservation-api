import { Business } from 'src/business/entities/business.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessService } from './business-service.entity';

@Entity()
export class BusinessServicePrice extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToMany(() => Business, (bus: Business) => bus.businessServicesPrices)
  business: Business;

  @OneToOne(() => BusinessService, (ser: BusinessService) => ser.price)
  businessService: BusinessService;

  @Column('int')
  price: number;
}
