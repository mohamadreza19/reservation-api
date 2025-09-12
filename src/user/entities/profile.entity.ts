import { SharedColumn } from 'src/common/models/shared-columns';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile extends SharedColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  img: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
