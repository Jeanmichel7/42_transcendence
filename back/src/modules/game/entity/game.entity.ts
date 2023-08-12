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
  status: 'waiting' | 'playing' | 'waiting_start' | 'finished' | 'aborted';

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
  updatedAt: Date;

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

  @Column({ type: Number, default: 1500 })
  eloScorePlayer1: number;

  @Column({ type: Number, default: 1500 })
  eloScorePlayer2: number;

  @Column({ type: Number, default: 1 })
  levelPlayer1: number;

  @Column({ type: Number, default: 1 })
  levelPlayer2: number;

  @Column({ type: Number, default: 0 })
  expPlayer1: number;

  @Column({ type: Number, default: 0 })
  expPlayer2: number;

  /* users */
  @ManyToOne(() => UserEntity, (user) => user.gamesAsPlayer1, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  player1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.gamesAsPlayer2, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  player2: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.wonGames, {
    onDelete: 'CASCADE',
    nullable: true,
    cascade: true,
  })
  winner: UserEntity;
}
