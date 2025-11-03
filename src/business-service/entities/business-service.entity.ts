import { Business } from 'src/business/entities/business.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import { Service } from 'src/service/entities/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessServicePrice } from './business-service-price.entity';

@Entity()
export class BusinessService extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (ser: Service) => ser.businessServices)
  service: Service;

  @ManyToOne(() => Business, (bus: Business) => bus.businessServices)
  business: Business;

  @Column({
    unique: true,
  })
  name: string;

  @OneToOne(
    () => BusinessServicePrice,
    (bsp: BusinessServicePrice) => bsp.price,
  )
  @JoinColumn()
  price: BusinessServicePrice;
}
