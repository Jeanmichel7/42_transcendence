import { Dispatch } from '@reduxjs/toolkit';
import { RefObject, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  userGameStatus: (message: string) => void;
  gameUpdate: (data: GameData) => void;
  privateLobby: (opponentStatus: PlayerStatus) => void;
}

export interface PlayerStatus {
  gameId: bigint;
  mode: string;
  ready: boolean;
  isPlayer1: boolean;
}

export interface ClientToServerEvents {
  clientUpdate: (data: {
    posRacket: number;
    ArrowDown: boolean;
    ArrowUp: boolean;
    gameId: number;
    useBonus: boolean;
  }) => void;
  hello: () => void;
  privateLobby: (data: {
    gameId: string;
    mode: string;
    ready: boolean;
    player1: boolean;
  }) => void;
  spectateGame: (gameId: bigint) => void;
}
export interface SocketInterface {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export interface BonusPosition {
  x: number;
  y: number;
  boxSize: number;
}

export interface GameData {
  ball: { x: number; y: number; vx: number; vy: number; speed: number };
  racketRight: number;
  racketLeft: number;
  winner: string | null;
  player1Score: number;
  player2Score: number;
  gameId: number;
  isPlayerRight: boolean;
  player1Username: string;
  player2Username: string;
  gameStart: boolean;
  bonus: BonusPosition | null;
  bonusPlayer1: number | null;
  bonusPlayer2: number | null;
  racketLeftHeight: number;
  racketRightHeight: number;
  bonusPlayer1Loading: boolean;
  bonusPlayer2Loading: boolean;
  player1Laser: boolean;
  player2Laser: boolean;
  bonusMode: boolean;
}

type GameProps = {
  keyStateRef: RefObject<{
    ArrowUp: boolean;
    ArrowDown: boolean;
    ' ': boolean;
  }>;
  posRacket: RefObject<{ left: number; right: number }>;
  gameId: RefObject<bigint>;
  scorePlayers: RefObject<{ left: number; right: number }>;
  bonusPositionRef: RefObject<BonusPosition | null>;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  bonusIsLoading: RefObject<boolean>;
  bonusValueRef: RefObject<number | null>;
  racketHeightRef: RefObject<{ left: number; right: number }>;
  laser: RefObject<{ left: boolean; right: boolean }>;
};
