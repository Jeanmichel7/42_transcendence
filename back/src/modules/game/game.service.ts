import { Injectable } from '@nestjs/common';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 1;
const BALL_POS_MAX = 980;
const SCORE_FOR_WIN = 5;

// Variable constante for optimisation, don't change
const RACKET_FACTOR = (100 / RACKET_HEIGHT) * 100;
const RACKET_FACTOR_1000 = RACKET_FACTOR / 1000;
const RACKET_WIDTH_10 = RACKET_WIDTH * 10;
const RACKET_HEIGHT_10 = RACKET_HEIGHT * 10;
const RACKET_LEFT_POS_X_10 = RACKET_LEFT_POS_X * 10;
const RACKET_RIGHT_POS_X_10 = RACKET_RIGHT_POS_X * 10;

class Game {
  ball: { x: number; y: number; vx: number; vy: number };
  racketLeft: number;
  racketRight: number;
  isOver: boolean;
  winner: string;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;

  constructor(player1Id: string, player2Id: string) {
    this.isOver = false;
    this.ball = { x: 0, y: 0, vx: 0, vy: 0 };
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.winner = '';
  }

  updateBallPosition() {
    if (this.ball.x > BALL_POS_MAX || this.ball.x < 0) {
      this.ball.vx = -this.ball.vx;
    }
    if (this.ball.y > BALL_POS_MAX || this.ball.y < 0) {
      this.ball.vy = this.ball.vy;
    }
    if (
      this.ball.x <= RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 &&
      this.ball.y >= this.racketLeft &&
      this.ball.y <= this.racketLeft + RACKET_HEIGHT_10
    )
      this.ball.vx = this.ball.vx;
    else if (
      this.ball.x >= RACKET_RIGHT_POS_X_10 &&
      this.ball.y >= this.racketRight &&
      this.ball.y <= this.racketRight + RACKET_HEIGHT_10
    )
      if (this.ball.x <= 0 && !this.isOver) {
        if (this.player1Score > SCORE_FOR_WIN) {
          this.isOver = true;
          this.winner = 'left';
        } else {
          this.player1Score += 1;
        }
      } else if (this.ball.x <= 0 && !this.isOver) {
        if (this.player2Score > SCORE_FOR_WIN) {
          this.isOver = true;
          this.winner = 'right';
        } else {
          this.player2Score += 1;
        }
      }
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
  }
}

@Injectable()
export class GameService {
  games: Game[];
  constructor() {
    this.games = [];
  }

  getGames(): Game[] {
    return this.games;
  }
  updateGame(game) {
    return { message: 'updateGame' };
  }

  test() {
    return { message: 'test' };
  }

  test2() {
    return { message: 'test2' };
  }
}
