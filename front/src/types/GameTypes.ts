import { UserInterface } from './UserTypes';

export interface GameInterface {
  id: number;
  status: 'waiting' | 'waiting_start' | 'playing' | 'finished' | 'aborted';
  player1: UserInterface;
  player2: UserInterface;
  eloScorePlayer1: number;
  eloScorePlayer2: number;
  levelPlayer1: number;
  levelPlayer2: number;
  expPlayer1: number;
  expPlayer2: number;
  createdAt: Date;
  finishAt?: Date;
  abortedAt?: Date;
  scorePlayer1?: number;
  scorePlayer2?: number;
  winner?: UserInterface;
}
