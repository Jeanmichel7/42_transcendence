import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from 'config';
import { TrophiesEntity } from './trophies.entity';

@Entity('trophies_progress')
export class UserTrophiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.trophiesProgress, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => TrophiesEntity, trophy => trophy.trophiesProgress, {
    onDelete: 'CASCADE',
  })
  trophy: TrophiesEntity;

  @Column({ default: 0 })
  progress: number;

  @Column()
  total: number;
}
