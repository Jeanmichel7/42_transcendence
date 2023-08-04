import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserEntity } from 'config';
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

  @ManyToMany(() => UserEntity, (user) => user.trophies)
  users: UserEntity[];
}
