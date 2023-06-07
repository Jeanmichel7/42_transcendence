import { Injectable } from '@nestjs/common';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 10;
const GROUND_MAX_SIZE = 1000;
const SCORE_FOR_WIN = 50;
const INITIAL_BALL_SPEED = 0.25;
const SPEED_INCREASE = 0.04;
const bonus_id = ['racketSize', 'slow', 'laser']

// Variable constante for optimisation, don't change
const BALL_RADIUS = BALL_DIAMETER / 2;
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
  ball: { x: number; y: number; vx: number; vy: number; speed: number };
  racketLeft: number;
  racketRight: number;
  isOver: boolean;
  winner: string;
  socketPlayer1Id: string;
  socketPlayer2Id: string;
  player1Username: string;
  player2Username: string;
  player1Score: number;
  player2Score: number;
  player1ArrowUp: boolean;
  player1ArrowDown: boolean;
  player2ArrowUp: boolean;
  player2ArrowDown: boolean;
  lastTime: number;
  id: string;
  gameStart: boolean;
  startTime: number;
  fail: boolean;
  bonuses: any[];
  bonusesLastGeneration: number;

  constructor(
    socketPlayer1Id: string,
    player1Username: string,
    socketPlayer2Id: string,
    player2Username: string,
  ) {
    this.isOver = false;
    this.ball = {
      x: 500,
      y: 500,
      vx: INITIAL_BALL_SPEED,
      vy: 0,
      speed: INITIAL_BALL_SPEED,
    };
    this.socketPlayer1Id = socketPlayer1Id;
    this.socketPlayer2Id = socketPlayer2Id;
    this.player1Username = player1Username;
    this.player2Username = player2Username;
    this.bonusesLastGeneration = performance.now();
    this.winner = null;
    this.lastTime = performance.now();
    this.id = Math.random().toString(36).substr(2, 9);
    this.player1Score = 0;
    this.player2Score = 0;
    this.racketLeft = 500 - RACKET_HEIGHT_10 / 2;
    this.racketRight = 500 - RACKET_HEIGHT_10 / 2;
    this.gameStart = false;
    this.startTime = performance.now();
    this.fail = false;
    this.bonuses = [];
  }

  generateBonus() {
    const bonus = {
      x: Math.random() * GROUND_MAX_SIZE,
      y: Math.random() * GROUND_MAX_SIZE,
      id: bonus_id[Math.floor(Math.random() * bonus_id.length)],
      boxSize: 10
    }
    this.bonuses.push(bonus);
  }


  checkBonusCollision() {
    this.bonuses.forEach((bonus) => {
      if (
        this.ball.x + BALL_RADIUS > bonus.x &&
        this.ball.x - BALL_RADIUS < bonus.x + bonus.boxSize &&
        this.ball.y + BALL_RADIUS > bonus.y &&
        this.ball.y - BALL_RADIUS < bonus.y + bonus.boxSize
      ) {
      }
      return false;
    })}
  updateBallPosition() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    if (!this.gameStart) {
      if (currentTime - this.startTime > 3000) {
        this.gameStart = true;
      } else {
        return;
      }
    }
    if(currentTime - this.bonusesLastGeneration > 20000) {  
      this.bonusesLastGeneration = currentTime;
      this.generateBonus();
    }

    if (
      this.ball.y + BALL_RADIUS > GROUND_MAX_SIZE ||
      this.ball.y - BALL_RADIUS < 0
    ) {
      this.ball.vy = -this.ball.vy;
      if (this.ball.y + BALL_RADIUS > GROUND_MAX_SIZE) {
        this.ball.y = GROUND_MAX_SIZE - BALL_RADIUS;
      } else {
        this.ball.y = BALL_RADIUS;
      }
    }
    if (
      this.ball.x <= RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS &&
      this.ball.y >= this.racketLeft &&
      this.ball.y <= this.racketLeft + RACKET_HEIGHT_10 &&
      !this.fail
    ) {
      console.log('fail');
      this.ball.x = RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS;
      if (this.player1ArrowDown) {
        this.ball.vy += SPEED_INCREASE;
        this.ball.vx = -this.ball.vx;
        this.ball.speed += SPEED_INCREASE;
      } else if (this.player1ArrowUp) {
        this.ball.vy -= SPEED_INCREASE;
        this.ball.vx = -this.ball.vx;
        this.ball.speed -= SPEED_INCREASE;
      } else {
        const racketCenter = this.racketLeft + RACKET_HEIGHT_10 / 2 ;
        const relativePostion = this.ball.y - racketCenter;
        let proportion = relativePostion / (RACKET_HEIGHT_10 / 2);
        proportion = Math.max(Math.min(proportion, 0.9), -0.9);
        this.ball.speed += SPEED_INCREASE;
        this.ball.vy = proportion;
        this.ball.vx = Math.sqrt(1 - this.ball.vy*this.ball.vy) * this.ball.speed;; 
        this.ball.vy *= this.ball.speed;
      }
    } else if (
      this.ball.x >= RACKET_RIGHT_POS_X_10 - BALL_RADIUS &&
      this.ball.y >= this.racketRight &&
      this.ball.y <= this.racketRight + RACKET_HEIGHT_10 &&
      !this.fail
    ) {
      this.ball.x = RACKET_RIGHT_POS_X_10 - BALL_RADIUS;
      if (this.player2ArrowDown) {
        this.ball.vy += SPEED_INCREASE;
        this.ball.vx = -this.ball.vx;
        this.ball.speed += SPEED_INCREASE;
      } else if (this.player2ArrowUp) {
        this.ball.vy -= SPEED_INCREASE;
        this.ball.vx = -this.ball.vx;
        this.ball.speed -= SPEED_INCREASE;
      } else {
        const racketCenter = this.racketRight + RACKET_HEIGHT_10 /2 ;
        const relativePostion = this.ball.y - racketCenter;
        let proportion = relativePostion / (RACKET_HEIGHT_10 / 2) ;
        proportion =  Math.max(Math.min(proportion, 0.9), -0.9);
        this.ball.speed += SPEED_INCREASE;
        this.ball.vy = proportion;
        this.ball.vy = Math.min(this.ball.vy, 0.9);  
this.ball.vy = Math.max(this.ball.vy, -0.9); 
        this.ball.vx =  Math.sqrt(1 - this.ball.vy*this.ball.vy) * this.ball.speed;
        this.ball.vy *= this.ball.speed;
        this.ball.vx = -this.ball.vx;
      }
    } else if (
      this.ball.x < RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS ||
      this.ball.x > RACKET_RIGHT_POS_X_10 - BALL_RADIUS
    ) {
      this.fail = true;
    }
    if (
      this.ball.x <
        RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS - 200 &&
      !this.isOver
    ) {
      if (this.player1Score > SCORE_FOR_WIN) {
        this.isOver = true;
        this.winner = this.player1Username;
        console.log('game over');
        console.log(this.winner);
      } else {
        this.player1Score += 1;
        console.log(this.player1Score);
        this.ball.x = 500;
        this.ball.y = 500;
        this.ball.vx = INITIAL_BALL_SPEED;
        this.ball.vy = 0;
        this.ball.speed = INITIAL_BALL_SPEED;
        this.fail = false;
      }
    } else if (
      this.ball.x > RACKET_RIGHT_POS_X_10 - BALL_RADIUS + 200 &&
      !this.isOver
    ) {
      if (this.player2Score > SCORE_FOR_WIN) {
        this.isOver = true;
        this.winner = this.player2Username;
        console.log('game over');
        console.log(this.winner);
      } else {
        this.player2Score += 1;
        this.ball.x = 500;
        this.ball.y = 500;
        this.ball.vy = 0;
        this.ball.vx = -INITIAL_BALL_SPEED;
        this.ball.speed = INITIAL_BALL_SPEED;
        this.fail = false;
      }
    }
    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;
  }

  getState() {
    return {
      ball: this.ball,
      racketRight: this.racketRight,
      racketLeft: this.racketLeft,
      winner: this.winner,
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      gameId: this.id,
      isPlayerRight: false,
      player1Username: this.player1Username,
      player2Username: this.player2Username,
      gameStart: this.gameStart,
      bonuses: this.bonuses,
    };
  }

  updateGameData(clientData: clientUpdate, clientId: string) {
    if (clientId === this.socketPlayer1Id) {
      this.racketLeft = clientData.posRacket;
      this.player1ArrowDown = clientData.ArrowDown;
      this.player1ArrowUp = clientData.ArrowUp;
    } else if (clientId === this.socketPlayer2Id) {
      this.racketRight = clientData.posRacket;
      this.player2ArrowDown = clientData.ArrowDown;
      this.player2ArrowUp = clientData.ArrowUp;
    }
  }
}

/**
 * - *
 * - *
 * - *
 * - *
 * - *
 * - *
 * - *
 * - *
 */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameEntity } from './entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameInterface } from './interfaces/game.interface';

@Injectable()
export class GameService {
  games: Map<string, Game>;
  playerWaiting1: any;
  playerWaiting2: any;

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.games = new Map<string, Game>();
  }

  /** **********************
   *        YANN PART
   *********************** */

  getGames(): Map<string, Game> {
    return this.games;
  }
  updateGame(game: Game) {
    game.updateBallPosition();
    if (game.isOver) {
      this.games.delete(game.id);
    }
    return game.getState();
  }
  checkAlreadyInGame(username: string): boolean {
    try {
      this.games.forEach((game) => {
        if (
          game.player1Username === username ||
          game.player2Username === username
        ) {
          throw new Error('Already in game');
        }
      });
    } catch (e) {
      return true;
    }
    return false;
  }

  updateClientSocketId(newSocketId: string, username: string) {
    this.games.forEach((game) => {
      if (game.player1Username === username) {
        console.log('update socket id');
        game.socketPlayer1Id = newSocketId;
      } else if (game.player2Username === username) {
        console.log('update socket id');
        game.socketPlayer2Id = newSocketId;
      }
    });
  }

  addToQueue(socketId: string, username: string) {
    if (this.checkAlreadyInGame(username)) return;
    console.log('add to queue username : ', username);
    if (this.playerWaiting1 === undefined) {
      this.playerWaiting1 = {
        socketId: socketId,
        username: username,
      };
    } else if (
      this.playerWaiting2 === undefined // &&
      // this.playerWaiting1.username !== username
    ) {
      this.playerWaiting2 = {
        socketId: socketId,
        username: username,
      };
      console.log('Game created');
      const game = new Game(
        this.playerWaiting1.socketId,
        this.playerWaiting1.username,
        this.playerWaiting2.socketId,
        this.playerWaiting2.username,
      );
      this.games.set(game.id, game);
      this.playerWaiting1 = undefined;
      this.playerWaiting2 = undefined;
      return game.socketPlayer1Id;
    }
  }

  removeFromQueue(SocketId: string) {
    if (this.playerWaiting1 === SocketId) {
      this.playerWaiting1 = undefined;
      console.log('player1 removed from queue');
    }
  }

  updateClientData(clientData: clientUpdate, clientId: string) {
    if (clientData.gameId)
      this.games.get(clientData.gameId)?.updateGameData(clientData, clientId);
  }

  /** **********************
   *         JM PART
   *********************** */

  // async saveNewGame(userId1: bigint, userId2: bigint): Promise<GameInterface> {
  async saveNewGame(userId1: bigint, userId2: bigint): Promise<GameInterface> {
    const newGame = new GameEntity();
    newGame.player1 = await this.userRepository.findOne({
      where: { id: userId1 },
    });
    newGame.player2 = await this.userRepository.findOne({
      where: { id: userId2 },
    });
    newGame.status = 'playing';
    newGame.createdAt = new Date();
    await this.gameRepository.save(newGame);

    const result: GameInterface = newGame;
    console.log('result create game : ', result);
    return result;
  }

  async saveEndGame(
    gameId: bigint,
    winnerId: bigint,
    scorePlayer1: number,
    scorePlayer2: number,
  ): Promise<GameInterface> {
    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: gameId },
    });
    game.status = 'finished';
    game.finishAt = new Date();
    game.scorePlayer1 = scorePlayer1;
    game.scorePlayer2 = scorePlayer2;
    game.winner = await this.userRepository.findOne({
      where: { id: winnerId },
    });
    await this.gameRepository.save(game);

    const result: GameInterface = game;
    console.log('result end game : ', result);
    return result;
  }

  async getAllUserGames(userId: bigint): Promise<GameInterface[]> {
    const games: GameEntity[] = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.player1', 'player1')
      .leftJoinAndSelect('game.player2', 'player2')
      .leftJoinAndSelect('game.winner', 'winner')
      .select([
        'game',
        'player1.id',
        'player1.firstName',
        'player1.lastName',
        'player1.login',
        'player2.id',
        'player2.firstName',
        'player2.lastName',
        'player2.login',
        'winner.id',
        'winner.firstName',
        'winner.lastName',
        'winner.login',
      ])
      .where('(player1.id = :userId OR player2.id = :userId)', { userId })
      .orderBy('game.createdAt', 'DESC')
      .getMany();

    const result: GameInterface[] = games;
    console.log('result get all game : ', result);
    return result;
  }
}
