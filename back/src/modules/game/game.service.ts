import { Injectable } from '@nestjs/common';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 1;
const BALL_POS_MAX = 980;
const SCORE_FOR_WIN = 5;
const INITIAL_BALL_SPEED = 0.4;
const SPEED_INCREASE = 0.06;

// Variable constante for optimisation, don't change
const RACKET_FACTOR = (100 / RACKET_HEIGHT) * 100;
const RACKET_FACTOR_1000 = RACKET_FACTOR / 1000;
const RACKET_WIDTH_10 = RACKET_WIDTH * 10;
const RACKET_HEIGHT_10 = RACKET_HEIGHT * 10;
const RACKET_LEFT_POS_X_10 = RACKET_LEFT_POS_X * 10;
const RACKET_RIGHT_POS_X_10 = RACKET_RIGHT_POS_X * 10;

interface clientUpdate {
  posRacket: number;
  ArrowDown: boolean;
  ArrowUp: boolean;
  gameId: string;
}

export class Game {
  ball: { x: number; y: number; vx: number; vy: number };
  racketLeft: number;
  racketRight: number;
  isOver: boolean;
  winner: string;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  player1ArrowUp: boolean;
  player1ArrowDown: boolean;
  player2ArrowUp: boolean;
  player2ArrowDown: boolean;
  lastTime: number;
  id: string;

  constructor(player1Id: string, player2Id: string) {
    this.isOver = false;
    this.ball = {
      x: 500,
      y: 500,
      vx: INITIAL_BALL_SPEED,
      vy: INITIAL_BALL_SPEED,
    };
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.winner = '';
    this.lastTime = performance.now();
    this.id = Math.random().toString(36).substr(2, 9);
  }

  updateBallPosition() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    if (this.ball.x > BALL_POS_MAX || this.ball.x < 0) {
      this.ball.vx = -this.ball.vx;
      if (this.ball.x > BALL_POS_MAX) {
        this.ball.x = BALL_POS_MAX;
      } else {
        this.ball.x = 0;
      }
    }
    if (this.ball.y > BALL_POS_MAX || this.ball.y < 0) {
      this.ball.vy = -this.ball.vy;
      if (this.ball.y > BALL_POS_MAX) {
        this.ball.y = BALL_POS_MAX;
      } else {
        this.ball.y = 0;
      }
    }
    if (
      this.ball.x <= RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 &&
      this.ball.y >= this.racketLeft &&
      this.ball.y <= this.racketLeft + RACKET_HEIGHT_10
    ) {
      this.ball.vx = -this.ball.vx;
      this.ball.x = RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10;
    } else if (
      this.ball.x >= RACKET_RIGHT_POS_X_10 &&
      this.ball.y >= this.racketRight &&
      this.ball.y <= this.racketRight + RACKET_HEIGHT_10
    ) {
      this.ball.vx = -this.ball.vx;
      this.ball.x = RACKET_RIGHT_POS_X_10;
    }
    if (this.ball.x <= RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 && !this.isOver) {
      if (this.player1Score > SCORE_FOR_WIN) {
        this.isOver = true;
        this.winner = 'left';
      } else {
        this.player1Score += 1;
      }
      if (this.player1ArrowDown) {
        this.ball.vy += SPEED_INCREASE;
      }
      if (this.player1ArrowUp) {
        this.ball.vy -= SPEED_INCREASE;
      }
    } else if (this.ball.x >= RACKET_RIGHT_POS_X_10 && !this.isOver) {
      if (this.player2Score > SCORE_FOR_WIN) {
        this.isOver = true;
        this.winner = 'right';
      } else {
        this.player2Score += 1;
      }
    }
    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;
  }

  getState() {
    return {
      ball: this.ball,
      racketRight: this.racketRight,
      winner: this.winner,
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      gameId: this.id,
      isPlayerRight: false,
    };
  }

  updateGameData(clientData: clientUpdate, clientId: string) {
    if (clientId === this.player1Id) {
      this.racketLeft = clientData.posRacket;
      this.player1ArrowDown = clientData.ArrowDown;
      this.player1ArrowUp = clientData.ArrowUp;
    } else if (clientId === this.player2Id) {
      this.racketRight = clientData.posRacket;
      this.player2ArrowDown = clientData.ArrowDown;
      this.player2ArrowUp = clientData.ArrowUp;
    }
  }
}

@Injectable()
export class GameService {
  games: Map<string, Game>;
  playerWaiting1: string;
  playerWaiting2: string;

  constructor() {
    this.games = new Map<string, Game>();
  }

  getGames(): Map<string, Game> {
    return this.games;
  }
  updateGame(game: Game) {
    game.updateBallPosition();
    return game.getState();
  }
  addToQueue(playerId: string) {
    if (this.playerWaiting1 === undefined) {
      this.playerWaiting1 = playerId;
    } else if (
      this.playerWaiting2 === undefined &&
      this.playerWaiting1 !== playerId
    ) {
      this.playerWaiting2 = playerId;
      const game = new Game(this.playerWaiting1, this.playerWaiting2);
      this.games.set(game.id, game);
      this.playerWaiting1 = undefined;
      this.playerWaiting2 = undefined;
    }
  }

  updateClientData(clientData: clientUpdate, clientId: string) {
    if (clientData.gameId)
      this.games.get(clientData.gameId)?.updateGameData(clientData, clientId);
  }

  test() {
    return { message: 'test' };
  }

  test2() {
    return { message: 'test2' };
  }
}
