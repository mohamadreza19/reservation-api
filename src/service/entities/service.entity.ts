// service.entity.ts
import { BusinessService } from 'src/business-service/entities/business-service.entity';
import { SharedColumn } from 'src/common/models/shared-columns';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true }) // Add icon field to store file path
  icon: string;

  @OneToMany(() => BusinessService, (bs: BusinessService) => bs.service)
  businessServices: BusinessService[];
}
