import { Employee } from 'src/features/employee/entities/employee.entity';
import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  icon: string;

  @Column({
    nullable: true,
  })
  subDomainName: string;

  @Column({
    nullable: true,
  })
  busunessCategoryId: number;

  @OneToMany(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.business,
  )
  serviceProfiles: ServiceProfile[];

  @OneToMany(() => Employee, (employee: Employee) => employee.master)
  employees: Employee[];
}
