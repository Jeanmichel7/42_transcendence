import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'config';
import { UserTrophiesEntity } from './userTrophiesProgress.entity';

@Entity('trophies')
export class TrophiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  imagePath: string;

  @Column({ default: 0 })
  total: number;

  @OneToMany(() => UserTrophiesEntity, userTrophy => userTrophy.trophy, {
    onDelete: 'CASCADE',
  })
  trophiesProgress: UserTrophiesEntity[];

  @ManyToMany(() => UserEntity, user => user.trophies, {
    onDelete: 'CASCADE',
  })
  users: UserEntity[];
}
