import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './business.entity';
import { SharedColumn } from 'src/common/models/shared-columns';

@Entity()
export class BProfile extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-json', { nullable: true })
  location: { lat: number; lng: number };

  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  address: string;

  @OneToOne(() => Business, (b) => b.bProfile)
  business: Business;
}
