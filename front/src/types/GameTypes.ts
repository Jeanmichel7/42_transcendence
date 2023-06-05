import { UserInterface } from './UserTypes';

export interface GameInterface {
  id: number;
  status: 'waiting' | 'playing' | 'finished' | 'aborted';
  player1: UserInterface;
  player2: UserInterface;
  createdAt: Date;
  finishAt?: Date;
  abortedAt?: Date;
  scorePlayer1?: number;
  scorePlayer2?: number;
  winner?: UserInterface;
}