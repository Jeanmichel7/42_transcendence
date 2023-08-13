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
  bonus: BonusPosition | undefined;
  bonusPlayer1: string | undefined;
  bonusPlayer2: string | undefined;
  racketLeftHeight: number;
  racketRightHeight: number;
  bonusPlayer1Loading: boolean;
  bonusPlayer2Loading: boolean;
  player1Laser: boolean;
  player2Laser: boolean;
  bonusMode: boolean;
  player1Avatar: string;
  player2Avatar: string;
}
