import { Injectable } from '@nestjs/common';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 10;
const GROUND_MAX_SIZE = 1000;
const SCORE_FOR_WIN = 5;
const INITIAL_BALL_SPEED = 0.25;
const SPEED_INCREASE = 0.04;
const BONUSES_TAB = 
[{id: 'bigRacket', duration: 10000, timeStart: 0, activate: false}
,{id: 'slow', duration: 0, timeStart: 0, activate: false}
,{id: 'laser', duration: 10000, timeStart: 0, activate: false}];

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
  useBonus: boolean;
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

  bonus: any;
  bonusesLastGeneration: number;
  bonusesPlayer1: any;
  bonusPlayer1Loading: boolean;
  bonusesPlayer2: any;
  bonusPlayer2Loading: boolean;
  bonusPlayer1Start: number;
  bonusesPlayer2Start: number;
  racketLeftHeight: number;
  racketRightHeight: number;
  player1useBonus: boolean;
  player2useBonus: boolean;
  player1Laser: boolean;
  player2Laser: boolean;
  racketLeftDamage: number;
  racketRightDamage: number;
  bonusMode: boolean;


  constructor(
    socketPlayer1Id: string,
    player1Username: string,
    socketPlayer2Id: string,
    player2Username: string,
    bonusMode: boolean = false,
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
    this.bonus = null;
    this.bonusesPlayer1 = [];
    this.bonusesPlayer2 = [];
    this.racketLeftDamage = 0;
    this.racketRightDamage = 0;
    this.bonusesLastGeneration = performance.now();
    this.racketLeftHeight = RACKET_HEIGHT_10;
    this.racketRightHeight = RACKET_HEIGHT_10;
    this.player1useBonus = false;
    this.player2useBonus = false;
    this.bonusPlayer1Loading = false;
    this.bonusPlayer2Loading = false;
    this.player1Laser = false;
    this.player2Laser = false;
    this.bonusMode = bonusMode;
  }

  generateBonus() {
    if (this.bonus === null)
    {
      let x; 
      do 
      x = Math.random() * GROUND_MAX_SIZE;
      while (x < RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 || x > RACKET_RIGHT_POS_X_10);
      console.log('x : ', x);
      this.bonus = {
        x: x, 
        y: Math.random() * GROUND_MAX_SIZE,
        //id: bonus_id[Math.floor(Math.random() * bonus_id.length)],
        boxSize: 50,
      }
    }
  }

checkBonusCollision() {
  
  if (this.bonus) {
    const bonusRadius = this.bonus.boxSize / 2;

    if (
      this.ball.x + BALL_RADIUS > this.bonus.x - bonusRadius &&
      this.ball.x - BALL_RADIUS < this.bonus.x + bonusRadius &&
      this.ball.y + BALL_RADIUS > this.bonus.y - bonusRadius &&
      this.ball.y - BALL_RADIUS < this.bonus.y + bonusRadius
    ) {
      return true;
    }
  }
  
  return false;
}
  checkBonusDuration(currentTime: number) {

    let toDelete = -1;
    

    this.bonusesPlayer1.forEach((bonus, index) => {
    if (bonus && bonus.timeStart !== 0 && currentTime  > bonus.duration + bonus.timeStart) {
        toDelete = index;
        if (bonus.id == "bigRacket") {
          this.racketLeftHeight = RACKET_HEIGHT_10 * 2;
        }
        else if (bonus.id == "laser") {
          this.player1Laser = false;
    }
    }});
    if (toDelete !== -1) {
    this.bonusesPlayer1.splice(toDelete, 1);
    toDelete = 0;
    }

    this.bonusesPlayer2.forEach((bonus, index) => {
      if (bonus && bonus.timeStart !== 0 && currentTime  > bonus.duration + bonus.timeStart) {
          toDelete = index;
          if (bonus.id == "bigRacket") {
            this.racketLeftHeight = RACKET_HEIGHT_10 * 2;
          }
          else if (bonus.id == "laser") {
            this.player2Laser = false;
      }
      }});
      if (toDelete !== -1) {
        this.bonusesPlayer2.splice(toDelete, 1);
        toDelete = 0;
        }
 
}

  async assignRandomBonus() {
    if (this.ball.vx > 0) {
      this.bonusPlayer1Loading = true;
    } else {
      this.bonusPlayer2Loading = true;
    }
    await new Promise(resolve => setTimeout(resolve, 3000));

    const bonus = {...BONUSES_TAB[Math.floor(Math.random() * BONUSES_TAB.length)]};
  
    // Assigner le bonus à player1 ou player2 en fonction de this.ball.vx
    if (this.bonusPlayer1Loading) {
      this.bonusesPlayer1.push(bonus);
      this.bonusPlayer1Loading = false;
    } else {
      this.bonusesPlayer2.push(bonus);
      this.bonusPlayer2Loading = false;
    }
  }

  useBonus(player: boolean) {
    if (player == true) {
      if (this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id == "bigRacket") {
        console.log('bigRacket');
        this.racketLeftHeight = RACKET_HEIGHT_10 * 2;
      } else if (this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id  == "slow") {
        console.log('slow');
        this.ball.speed = INITIAL_BALL_SPEED;
      } else if (this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id  == "laser") {
        this.player1Laser = true;
        console.log('laser');
      }
      this.bonusesPlayer1[this.bonusesPlayer1.length - 1].timeStart = performance.now();
      this.bonusesPlayer1[this.bonusesPlayer1.length - 1].activate = true;
    }
    else {
      if (this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id == "bigRacket") {
        console.log('bigRacket');
        this.racketRightHeight = RACKET_HEIGHT_10 * 2;
      } else if (this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id == "slow") {
        console.log('slow');
        this.ball.speed = INITIAL_BALL_SPEED;
      } else if (this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id == "laser") {
        console.log('laser');
        this.player2Laser = true;
      }
      this.bonusesPlayer2[this.bonusesPlayer2.length - 1].timeStart = performance.now();
      this.bonusesPlayer2[this.bonusesPlayer2.length - 1].activate   = true;
    } 
  }

  checkLaserCollision() {
    // Assuming laser position is always in the center of the racket
    var laserPosition1 = this.racketLeft + this.racketLeftHeight / 2;
    var laserPosition2 = this.racketRight + this.racketRightHeight / 2;

    if (this.player1Laser) {
        // Check if the laser is within the height range of the right racket
        if (laserPosition1 >= this.racketRight && laserPosition1 <= (this.racketRight + this.racketRightHeight)) {
          this.racketRightDamage += 1;
          if (this.racketRightDamage >= 180) {
            this.racketRightHeight = 0;
            this.racketRightDamage = 0;
          }
        }
    }
    if (this.player2Laser) {
        // Check if the laser is within the height range of the left racket
        if (laserPosition2 >= this.racketLeft && laserPosition2 <= (this.racketLeft + this.racketLeftHeight)) {
          this.racketLeftDamage += 1;
          if (this.racketLeftDamage >= 180) {
            this.racketLeftHeight = 0;
            this.racketLeftDamage = 0;
          }
        }
    }
}



  updateBallPosition() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    if (!this.gameStart) {
      if (currentTime - this.startTime > 3001) {
        this.gameStart = true;
      } else {
        return;
      }
    }
    if (this.bonusMode) {
    if(this.bonus === null && currentTime - this.bonusesLastGeneration > 20000) {  
      this.bonusesLastGeneration = currentTime;
      this.generateBonus();
    }
    if (this.checkBonusCollision()){
      this.assignRandomBonus(); 
      this.bonusesLastGeneration = currentTime;
      this.bonus = null;
    }
    this.checkLaserCollision();
    this.checkBonusDuration(currentTime);
    if (this.player1useBonus && this.bonusesPlayer1[this.bonusesPlayer1.length - 1]?.activate === false) {
      this.useBonus(true);
    }
      if (this.player2useBonus && this.bonusesPlayer2[this.bonusesPlayer2.length - 1]?.activate === false) { 
      this.useBonus(false);
    }
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
      this.ball.y <= this.racketLeft + this.racketLeftHeight &&
      !this.fail
    ) {
      this.ball.x = RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 + BALL_RADIUS;
    
        const racketCenter = this.racketLeft + this.racketLeftHeight / 2 ;
        const relativePostion = this.ball.y - racketCenter;
        let proportion = relativePostion / (this.racketLeftHeight / 1);
        proportion = Math.max(Math.min(proportion, 0.9), -0.9);
        this.ball.speed += SPEED_INCREASE;
        this.ball.vy = proportion;
        this.ball.vx = Math.sqrt(1 - this.ball.vy*this.ball.vy) * this.ball.speed;; 
        this.ball.vy *= this.ball.speed;
      
    } else if (
      this.ball.x >= RACKET_RIGHT_POS_X_10 - BALL_RADIUS &&
      this.ball.y >= this.racketRight &&
      this.ball.y <= this.racketRight + this.racketRightHeight &&
      !this.fail
    ) {
      this.ball.x = RACKET_RIGHT_POS_X_10 - BALL_RADIUS;
     
        const racketCenter = this.racketRight + this.racketRightHeight /2 ;
        const relativePostion = this.ball.y - racketCenter;
        let proportion = relativePostion / (this.racketRightHeight / 2) ;
        proportion =  Math.max(Math.min(proportion, 0.9), -0.9);
        this.ball.speed += SPEED_INCREASE;
        this.ball.vy = proportion;
        this.ball.vy = Math.min(this.ball.vy, 0.9);  
        this.ball.vy = Math.max(this.ball.vy, -0.9); 
        this.ball.vx =  Math.sqrt(1 - this.ball.vy*this.ball.vy) * this.ball.speed;
        this.ball.vy *= this.ball.speed;
        this.ball.vx = -this.ball.vx;
      
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
      this.player2Score += 1;
      if (this.player2Score >= SCORE_FOR_WIN) {
        this.isOver = true;
        this.winner = this.player1Username;
      } else {
        this.ball.x = 500;
        this.ball.y = 500;
        this.ball.vx = INITIAL_BALL_SPEED;
        this.ball.vy = 0;
        this.ball.speed = INITIAL_BALL_SPEED;
        this.fail = false;
        this.racketLeftHeight = RACKET_HEIGHT_10;
        this.racketRightHeight = RACKET_HEIGHT_10;
      }
    } else if (
      this.ball.x > RACKET_RIGHT_POS_X_10 - BALL_RADIUS + 200 &&
      !this.isOver
    ) {
        this.player1Score += 1;
      if (this.player1Score >= SCORE_FOR_WIN) {
        this.isOver = true;
        this.winner = this.player2Username;
      } else {
        this.ball.x = 500;
        this.ball.y = 500;
        this.ball.vy = 0;
        this.ball.vx = -INITIAL_BALL_SPEED;
        this.ball.speed = INITIAL_BALL_SPEED;
        this.fail = false;
        this.racketRightHeight = RACKET_HEIGHT_10;
        this.racketLeftHeight = RACKET_HEIGHT_10; 
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
      bonus: this.bonus,
      bonusPlayer1: this.bonusesPlayer1?.length > 0 && this.bonusesPlayer1[this.bonusesPlayer1.length - 1].activate 
  ? null 
  : (this.bonusesPlayer1?.length > 0 ? this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id : null),
bonusPlayer2: this.bonusesPlayer2?.length > 0 && this.bonusesPlayer2[this.bonusesPlayer2.length - 1].activate 
  ? null 
  : (this.bonusesPlayer2?.length > 0 ? this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id : null),
      racketLeftHeight: this.racketLeftHeight,
      racketRightHeight: this.racketRightHeight,
      bonusPlayer1Loading: this.bonusPlayer1Loading,
      bonusPlayer2Loading: this.bonusPlayer2Loading,
      player1Laser: this.player1Laser,
      player2Laser: this.player2Laser,
      bonusMode: this.bonusMode
    };
  }

  updateGameData(clientData: clientUpdate, clientId: string) {
    if (clientId === this.socketPlayer1Id) {
      this.racketLeft = clientData.posRacket;
      this.player1ArrowDown = clientData.ArrowDown;
      this.player1ArrowUp = clientData.ArrowUp;
      this.player1useBonus = clientData.useBonus;
    } else if (clientId === this.socketPlayer2Id) {
      this.player2useBonus = clientData.useBonus;
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
  playerWaiting1Normal: any;
  playerWaiting2Normal: any;
  playerWaiting1Bonus: any;
  playerWaiting2Bonus: any;

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

  addToQueue(socketId: string, username: string, bonusMode: boolean = false) {
    if (this.checkAlreadyInGame(username)) return;
    if (bonusMode) {
      if (this.playerWaiting1Bonus === undefined) {
        this.playerWaiting1Bonus = {
          socketId: socketId,
          username: username,
        };
      } else if (
        this.playerWaiting2Bonus === undefined // &&
        // this.playerWaiting1Bonus.username !== username
      ) {
        this.playerWaiting2Bonus = {
          socketId: socketId,
          username: username,
        };
        console.log('Game created');
        const game = new Game(
          this.playerWaiting1Bonus.socketId,
          this.playerWaiting1Bonus.username,
          this.playerWaiting2Bonus.socketId,
          this.playerWaiting2Bonus.username,
          true
        );
        this.games.set(game.id, game);
        this.playerWaiting1Bonus = undefined;
        this.playerWaiting2Bonus = undefined;
        return game.socketPlayer1Id;
      }
    }
    else {
      console.log('normal mode');
    if (this.playerWaiting1Normal === undefined) {
      this.playerWaiting1Normal = {
        socketId: socketId,
        username: username,
      };
    } else if (
      this.playerWaiting2Normal === undefined // &&
      // this.playerWaiting1Normal.username !== username
    ) {
      this.playerWaiting2Normal = {
        socketId: socketId,
        username: username,
      };
      console.log('Game created');
      const game = new Game(
        this.playerWaiting1Normal.socketId,
        this.playerWaiting1Normal.username,
        this.playerWaiting2Normal.socketId,
        this.playerWaiting2Normal.username,
        false
      );
      this.games.set(game.id, game);
      this.playerWaiting1Normal = undefined;
      this.playerWaiting2Normal = undefined;
      return game.socketPlayer1Id;
    }
  }
  }

  removeFromQueue(Username: string) {
    if (this.playerWaiting1Normal?.username === Username) {
      this.playerWaiting1Normal = undefined;
      console.log('remove from queue');
    }
    else if (this.playerWaiting1Bonus?.username === Username) {
      this.playerWaiting1Bonus = undefined;
      console.log('remove from queue');
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
