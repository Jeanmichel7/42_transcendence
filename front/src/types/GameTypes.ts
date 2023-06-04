import { UserInterface } from './UserTypes';

export interface GameInterface {
  id: number;
  status: 'waiting' | 'playing' | 'finished' | 'aborted';
  player1: UserInterface;
  player2: UserInterface;
  createdAt: Date;
  finishAt?: Date | undefined;
  abortedAt?: Date | undefined;
  scorePlayer1?: number | undefined;
  scorePlayer2?: number | undefined;
  winner?: UserInterface | undefined;
}