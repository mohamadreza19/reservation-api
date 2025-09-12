import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
