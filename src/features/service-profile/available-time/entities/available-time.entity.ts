import { ServiceProfile } from 'src/features/service-profile/entities/service-profile.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AvailableTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ServiceProfile,
    (serviceProfile: ServiceProfile) => serviceProfile.availableTimes,
  )
  serviceProfile: ServiceProfile;
}
