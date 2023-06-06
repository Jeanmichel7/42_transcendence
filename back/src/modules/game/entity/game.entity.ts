import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'config';

@Entity('games')
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: bigint;

  @Column({
    type: 'text',
    default: 'in progress',
  })
  status: 'waiting' | 'playing' | 'finished' | 'aborted';

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  finishAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  abortedAt: Date;

  @Column({
    type: Number,
    nullable: true,
    default: 0,
  })
  scorePlayer1: number;

  @Column({
    type: Number,
    nullable: true,
    default: 0,
  })
  scorePlayer2: number;

  /* users */
  @ManyToOne(() => UserEntity, (user) => user.gamesAsPlayer1, {
    cascade: true,
  })
  player1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.gamesAsPlayer2, {
    cascade: true,
  })
  player2: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.wonGames, {
    nullable: true,
    cascade: true,
  })
  winner: UserEntity;
}
