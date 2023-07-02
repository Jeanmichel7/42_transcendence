import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface GameInterface {
  id: bigint;
  status: 'waiting' | 'waiting_start' | 'playing' | 'finished' | 'aborted';
  createdAt: Date;
  updatedAt?: Date;
  finishAt?: Date;
  abortedAt?: Date;
  scorePlayer1?: number;
  scorePlayer2?: number;
  player1?: UserInterface;
  player2?: UserInterface;
  winner?: UserInterface;
}


export interface clientUpdate {
  posRacket: number;
  ArrowDown: boolean;
  ArrowUp: boolean;
  gameId: bigint;
  useBonus: boolean;
}

export interface BonusPosition {
  x: number;
  y: number;
  boxSize: number;
}