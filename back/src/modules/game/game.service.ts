import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entity/game.entity';

const RACKET_WIDTH = 2;
const RACKET_HEIGHT = 16;
const RACKET_LEFT_POS_X = 5;
const RACKET_RIGHT_POS_X = 93;
const BALL_DIAMETER = 10;
const GROUND_MAX_SIZE = 1000;
const SCORE_FOR_WIN = 1;
const INITIAL_BALL_SPEED = 0.25;
const SPEED_INCREASE = 0.04;
const BONUSES_TAB = [
  { id: 'bigRacket', duration: 10000, timeStart: 0, activate: false },
  { id: 'slow', duration: 0, timeStart: 0, activate: false },
  { id: 'laser', duration: 10000, timeStart: 0, activate: false },
];

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
  gameId: bigint;
  useBonus: boolean;
}

interface BonusPosition {
  x: number;
  y: number;
  boxSize: number;
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
  id: bigint;
  gameStart: boolean;
  startTime: number;
  fail: boolean;

  bonus: BonusPosition;
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
    gameId: bigint,
    bonusMode = false,
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
    // this.initIdGame();
    this.id = gameId;
  }

  // async initIdGame() {
  //   console.log('ksuis lancee');
  //   const res = await this.gameRepository.saveNewGame(this.player1Username, this.player2Username);
  //   this.id = res.id.toString();
  //   console.log('id game " ', this.id);
  // }

  generateBonus() {
    if (this.bonus === null) {
      let x;
      do x = Math.random() * GROUND_MAX_SIZE;
      while (
        x < RACKET_LEFT_POS_X_10 + RACKET_WIDTH_10 ||
        x > RACKET_RIGHT_POS_X_10
      );
      console.log('x : ', x);
      this.bonus = {
        x: x,
        y: Math.random() * GROUND_MAX_SIZE,
        //id: bonus_id[Math.floor(Math.random() * bonus_id.length)],
        boxSize: 50,
      };
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
      if (
        bonus &&
        bonus.timeStart !== 0 &&
        currentTime > bonus.duration + bonus.timeStart
      ) {
        toDelete = index;
        if (bonus.id == 'bigRacket') {
          this.racketLeftHeight = RACKET_HEIGHT_10 * 2;
        } else if (bonus.id == 'laser') {
          this.player1Laser = false;
        }
      }
    });
    if (toDelete !== -1) {
      this.bonusesPlayer1.splice(toDelete, 1);
      toDelete = 0;
    }

    this.bonusesPlayer2.forEach((bonus, index) => {
      if (
        bonus &&
        bonus.timeStart !== 0 &&
        currentTime > bonus.duration + bonus.timeStart
      ) {
        toDelete = index;
        if (bonus.id == 'bigRacket') {
          this.racketLeftHeight = RACKET_HEIGHT_10 * 2;
        } else if (bonus.id == 'laser') {
          this.player2Laser = false;
        }
      }
    });
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
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const bonus = {
      ...BONUSES_TAB[Math.floor(Math.random() * BONUSES_TAB.length)],
    };

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
      if (
        this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id == 'bigRacket'
      ) {
        console.log('bigRacket');
        this.racketLeftHeight = RACKET_HEIGHT_10 * 2;
      } else if (
        this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id == 'slow'
      ) {
        console.log('slow');
        this.ball.speed = INITIAL_BALL_SPEED;
      } else if (
        this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id == 'laser'
      ) {
        this.player1Laser = true;
        console.log('laser');
      }
      this.bonusesPlayer1[this.bonusesPlayer1.length - 1].timeStart =
        performance.now();
      this.bonusesPlayer1[this.bonusesPlayer1.length - 1].activate = true;
    } else {
      if (
        this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id == 'bigRacket'
      ) {
        console.log('bigRacket');
        this.racketRightHeight = RACKET_HEIGHT_10 * 2;
      } else if (
        this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id == 'slow'
      ) {
        console.log('slow');
        this.ball.speed = INITIAL_BALL_SPEED;
      } else if (
        this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id == 'laser'
      ) {
        console.log('laser');
        this.player2Laser = true;
      }
      this.bonusesPlayer2[this.bonusesPlayer2.length - 1].timeStart =
        performance.now();
      this.bonusesPlayer2[this.bonusesPlayer2.length - 1].activate = true;
    }
  }

  checkLaserCollision() {
    // Assuming laser position is always in the center of the racket
    const laserPosition1 = this.racketLeft + this.racketLeftHeight / 2;
    const laserPosition2 = this.racketRight + this.racketRightHeight / 2;

    if (this.player1Laser) {
      // Check if the laser is within the height range of the right racket
      if (
        laserPosition1 >= this.racketRight &&
        laserPosition1 <= this.racketRight + this.racketRightHeight
      ) {
        this.racketRightDamage += 1;
        if (this.racketRightDamage >= 180) {
          this.racketRightHeight = 0;
          this.racketRightDamage = 0;
        }
      }
    }
    if (this.player2Laser) {
      // Check if the laser is within the height range of the left racket
      if (
        laserPosition2 >= this.racketLeft &&
        laserPosition2 <= this.racketLeft + this.racketLeftHeight
      ) {
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
      if (
        this.bonus === null &&
        currentTime - this.bonusesLastGeneration > 20000
      ) {
        this.bonusesLastGeneration = currentTime;
        this.generateBonus();
      }
      if (this.checkBonusCollision()) {
        this.assignRandomBonus();
        this.bonusesLastGeneration = currentTime;
        this.bonus = null;
      }
      this.checkLaserCollision();
      this.checkBonusDuration(currentTime);
      if (
        this.player1useBonus &&
        this.bonusesPlayer1[this.bonusesPlayer1.length - 1]?.activate === false
      ) {
        this.useBonus(true);
      }
      if (
        this.player2useBonus &&
        this.bonusesPlayer2[this.bonusesPlayer2.length - 1]?.activate === false
      ) {
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

      const racketCenter = this.racketLeft + this.racketLeftHeight / 2;
      const relativePostion = this.ball.y - racketCenter;
      let proportion = relativePostion / (this.racketLeftHeight / 1);
      proportion = Math.max(Math.min(proportion, 0.9), -0.9);
      this.ball.speed += SPEED_INCREASE;
      this.ball.vy = proportion;
      this.ball.vx =
        Math.sqrt(1 - this.ball.vy * this.ball.vy) * this.ball.speed;
      this.ball.vy *= this.ball.speed;
    } else if (
      this.ball.x >= RACKET_RIGHT_POS_X_10 - BALL_RADIUS &&
      this.ball.y >= this.racketRight &&
      this.ball.y <= this.racketRight + this.racketRightHeight &&
      !this.fail
    ) {
      this.ball.x = RACKET_RIGHT_POS_X_10 - BALL_RADIUS;

      const racketCenter = this.racketRight + this.racketRightHeight / 2;
      const relativePostion = this.ball.y - racketCenter;
      let proportion = relativePostion / (this.racketRightHeight / 2);
      proportion = Math.max(Math.min(proportion, 0.9), -0.9);
      this.ball.speed += SPEED_INCREASE;
      this.ball.vy = proportion;
      this.ball.vy = Math.min(this.ball.vy, 0.9);
      this.ball.vy = Math.max(this.ball.vy, -0.9);
      this.ball.vx =
        Math.sqrt(1 - this.ball.vy * this.ball.vy) * this.ball.speed;
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
        this.winner = this.player2Username;
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
        this.winner = this.player1Username;
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
      bonusPlayer1:
        this.bonusesPlayer1?.length > 0 &&
        this.bonusesPlayer1[this.bonusesPlayer1.length - 1].activate
          ? null
          : this.bonusesPlayer1?.length > 0
          ? this.bonusesPlayer1[this.bonusesPlayer1.length - 1].id
          : null,
      bonusPlayer2:
        this.bonusesPlayer2?.length > 0 &&
        this.bonusesPlayer2[this.bonusesPlayer2.length - 1].activate
          ? null
          : this.bonusesPlayer2?.length > 0
          ? this.bonusesPlayer2[this.bonusesPlayer2.length - 1].id
          : null,
      racketLeftHeight: this.racketLeftHeight,
      racketRightHeight: this.racketRightHeight,
      bonusPlayer1Loading: this.bonusPlayer1Loading,
      bonusPlayer2Loading: this.bonusPlayer2Loading,
      player1Laser: this.player1Laser,
      player2Laser: this.player2Laser,
      bonusMode: this.bonusMode,
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

// import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { GameEntity } from './entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameInterface } from './interfaces/game.interface';
import {
  BadRequestException,
  // HttpException,
  // Injectable,
  // NotFoundException,
  // UnauthorizedException,
} from '@nestjs/common';
import { MessageCreateDTO } from '../messagerie/dto/message.create.dto';
import { MessageService } from '../messagerie/messages.service';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationCreateDTO } from '../notification/dto/notification.create.dto';
import { UserStatusInterface } from '../users/interfaces/status.interface';
import { UserUpdateEvent } from '../notification/events/notification.event';

@Injectable()
export class GameService {
  games: Map<bigint, Game>;
  playerWaiting1Normal: any;
  playerWaiting2Normal: any;
  playerWaiting1Bonus: any;
  playerWaiting2Bonus: any;
  createdWaitingGameBonus: GameInterface;
  createdWaitingGame: GameInterface;

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
    // private readonly messageRepository: Repository<MessageEntity>,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
  ) {
    this.games = new Map<bigint, Game>();
  }

  /** **********************
   *        YANN PART
   *********************** */

  getGames(): Map<bigint, Game> {
    return this.games;
  }
  async updateGame(game: Game) {
    game.updateBallPosition();
    if (game.isOver) {
      await this.saveEndGame(
        game.id,
        game.winner,
        game.player1Score,
        game.player2Score,
      );
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

  async addToQueue(socketId: string, username: string, bonusMode = false) {
    if (this.checkAlreadyInGame(username)) return;
    if (bonusMode) {
      if (this.playerWaiting1Bonus === undefined) {
        this.playerWaiting1Bonus = {
          socketId: socketId,
          username: username,
        };
        this.createdWaitingGameBonus = await this.saveCreateWaitingGame(
          this.playerWaiting1Bonus.username,
        );
        console.log('create waiting game : ', this.createdWaitingGameBonus);
      } else if (
        this.playerWaiting2Bonus === undefined &&
        this.playerWaiting1Bonus !== username
      ) {
        this.playerWaiting2Bonus = {
          socketId: socketId,
          username: username,
        };
        console.log('Game created');
        const res = await this.saveStartGame(
          this.playerWaiting2Bonus.username,
          this.createdWaitingGameBonus.id,
        );
        if (!res) throw new BadRequestException('erreur save start game');

        this.createdWaitingGameBonus = {} as GameInterface;

        const game: Game = new Game(
          this.playerWaiting1Bonus.socketId,
          this.playerWaiting1Bonus.username,
          this.playerWaiting2Bonus.socketId,
          this.playerWaiting2Bonus.username,
          res.id, // conversion foireuse
          true,
        );
        this.games.set(game.id, game);
        this.playerWaiting1Bonus = undefined;
        this.playerWaiting2Bonus = undefined;

        //res.id game
        return game.socketPlayer1Id;
      }
    } else {
      console.log('normal mode');
      if (this.playerWaiting1Normal === undefined) {
        this.playerWaiting1Normal = {
          socketId: socketId,
          username: username,
        };
        // createdWaitingGame
        this.createdWaitingGame = await this.saveCreateWaitingGame(
          this.playerWaiting1Normal.username,
        );
        console.log('create waiting game : ', this.createdWaitingGame);
      } else if (
        this.playerWaiting2Normal === undefined &&
        this.playerWaiting1Normal.username !== username
      ) {
        this.playerWaiting2Normal = {
          socketId: socketId,
          username: username,
        };
        console.log('Game created');

        const res = await this.saveStartGame(
          this.playerWaiting2Normal.username,
          this.createdWaitingGame.id,
        );
        if (!res) throw new BadRequestException('erreur save start game');

        this.createdWaitingGame = {} as GameInterface;

        const game = new Game(
          this.playerWaiting1Normal.socketId,
          this.playerWaiting1Normal.username,
          this.playerWaiting2Normal.socketId,
          this.playerWaiting2Normal.username,
          res.id, // conversion foireuse
          false,
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
      this.saveCancelWaitingGame(this.createdWaitingGame.id);
      this.createdWaitingGame = {} as GameInterface;
      console.log('remove from queue');
    } else if (this.playerWaiting1Bonus?.username === Username) {
      this.playerWaiting1Bonus = undefined;
      this.saveCancelWaitingGame(this.createdWaitingGameBonus.id);
      this.createdWaitingGameBonus = {} as GameInterface;
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

  async getGame(UserId: bigint, gameId: bigint): Promise<GameInterface> {
    const game: GameEntity = await this.gameRepository
      .createQueryBuilder('games')
      // .select('id', 'status')
      .leftJoin('games.player1', 'player1')
      .addSelect(['player1.id', 'player1.login'])
      .leftJoin('games.player2', 'player2')
      .addSelect(['player2.id', 'player2.login'])
      .where('games.id = :gameId', { gameId })
      .getOne();
    if (!game) throw new BadRequestException('game not found');

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: UserId },
    });
    if (!user) throw new BadRequestException('user not found');

    //check if user is in game
    if (game.player1.id !== user.id && game.player2.id !== user.id)
      throw new BadRequestException('user not in game');

    const result: GameInterface = game;
    console.log('result get game : ', result);
    return result;
  }

  async saveInviteGame(
    userId: bigint,
    userIdToInvite: bigint,
  ): Promise<GameInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('user not found');

    const userToInvite: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToInvite },
    });
    if (!userToInvite) throw new BadRequestException('user not found');

    const newGame = new GameEntity();
    newGame.player1 = user;
    newGame.player2 = userToInvite;
    newGame.status = 'waiting';
    newGame.createdAt = new Date();
    const newGameCreated: GameEntity = await this.gameRepository.save(newGame);
    console.log('invitation new game created : ', newGameCreated);

    //create message
    const newBotMessage: MessageCreateDTO = {
      text: `http://localhost:3006/game?id=${newGameCreated.id}`,
    };

    const res = await this.messageService.createInvitationBotMessage(
      newBotMessage,
      userId,
      userIdToInvite,
    );
    if (!res) throw new Error('Invitation game message not created');

    //event notification
    const newNotif: NotificationEntity =
      await this.notificationService.createNotification({
        type: 'gameInvite',
        content: `challenges you`,
        receiver: userToInvite,
        sender: {
          id: user.id,
          login: user.login,
          avatar: user.avatar,
        },
        invitationLink: `/game?id=${newGameCreated.id}`,
      } as NotificationCreateDTO);
    if (!newNotif) throw new Error('Notification not created');

    return newGameCreated;
  }

  async saveAcceptGame(userId: bigint, roomId: bigint): Promise<GameInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('user not found');
    console.log('user : ', user);
    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: roomId },
      relations: ['player1', 'player2'],
    });
    if (!game) throw new BadRequestException('game not found');
    console.log('game : ', game);

    if (game.status !== 'waiting')
      throw new BadRequestException('game already started');

    if (game.player2.id != user.id)
      throw new BadRequestException('You are not allowed to accept this game');

    game.status = 'waiting_start';
    game.updatedAt = new Date();
    const gameUpdated: GameEntity = await this.gameRepository.save(game);
    console.log('accept game : ', gameUpdated);

    //event notification
    const newNotif: NotificationEntity =
      await this.notificationService.createNotification({
        type: 'gameInviteAccepted',
        content: `'s challenge accepted, let's play`,
        receiver: {
          id: game.player1.id,
          login: game.player1.login,
          avatar: game.player1.avatar,
        },
        sender: {
          id: user.id,
          login: user.login,
          avatar: user.avatar,
        },
        invitationLink: `/game?id=${game.id}`,
      } as NotificationCreateDTO);
    if (!newNotif) throw new Error('Notification not created');

    return gameUpdated;
  }

  async saveDeclineGame(userId: bigint, roomId: bigint): Promise<void> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('user not found');

    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: roomId },
      relations: ['player1'],
    });
    if (!game) throw new BadRequestException('game not found');

    if (game.status !== 'waiting')
      throw new BadRequestException('game already started or no invitation');

    if (game.player2.id != user.id)
      throw new BadRequestException('You are not allowed to decline this game');
    await this.gameRepository.delete({ id: roomId });

    //event notification
    const newNotif: NotificationEntity =
      await this.notificationService.createNotification({
        type: 'gameInviteDeclined',
        content: `decline challenge`,
        receiver: {
          id: game.player1.id,
          login: game.player1.login,
          avatar: game.player1.avatar,
        },
        sender: {
          id: user.id,
          login: user.login,
          avatar: user.avatar,
        },
      } as NotificationCreateDTO);
    if (!newNotif) throw new Error('Notification not created');
  }

  async saveCreateWaitingGame(userlogin1: string): Promise<GameInterface> {
    const newGame = new GameEntity();
    newGame.player1 = await this.userRepository.findOne({
      where: { login: userlogin1 },
    });
    newGame.status = 'waiting';
    newGame.createdAt = new Date();
    await this.gameRepository.save(newGame);

    const result: GameInterface = newGame;
    console.log('result create game : ', result);
    return result;
  }

  async saveStartGame(
    userlogin2: string,
    gameId: bigint,
  ): Promise<GameInterface> {
    const findWaitingGame = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player1', 'player2'],
    });
    if (!findWaitingGame) throw new NotFoundException('game not found');

    const player1 = await this.userRepository.findOne({
      where: { login: findWaitingGame.player1.login },
    });
    if (!player1) throw new NotFoundException('player1 not found');

    const player2 = await this.userRepository.findOne({
      where: { login: userlogin2 },
    });
    if (!player2) throw new NotFoundException('player2 not found');

    findWaitingGame.player2 = player2;
    findWaitingGame.status = 'playing';
    findWaitingGame.updatedAt = new Date();

    const gameSaved: GameEntity = await this.gameRepository.save(
      findWaitingGame,
    );

    player1.status = 'in game';
    player1.updatedAt = new Date();
    await this.userRepository.save(player1);
    player2.status = 'in game';
    player2.updatedAt = new Date();
    await this.userRepository.save(player2);

    //event update status
    this.eventEmitter.emit(
      'user_status.updated',
      new UserUpdateEvent({
        id: player1.id,
        status: player1.status,
        login: player1.login,
      }),
    );

    this.eventEmitter.emit(
      'user_status.updated',
      new UserUpdateEvent({
        id: player2.id,
        status: player2.status,
        login: player2.login,
      }),
    );

    const result: GameInterface = gameSaved;
    // console.log('result create game : ', result);
    return result;
  }

  async saveCancelWaitingGame(gameId: bigint): Promise<void> {
    const findWaitingGame = await this.gameRepository.findOne({
      where: { id: gameId },
    });
    if (!findWaitingGame) throw new NotFoundException('game not found');
    await this.gameRepository.delete({ id: gameId });
  }

  async saveEndGame(
    gameId: bigint,
    winnerId: string,
    scorePlayer1: number,
    scorePlayer2: number,
  ): Promise<GameInterface> {
    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player1', 'player2'],
    });
    game.status = 'finished';
    game.finishAt = new Date();
    game.scorePlayer1 = scorePlayer1;
    game.scorePlayer2 = scorePlayer2;
    game.winner = await this.userRepository.findOne({
      where: { login: winnerId },
    });
    await this.gameRepository.save(game);

    // update status players to online
    game.player1.status = 'online';
    game.player1.updatedAt = new Date();
    await this.userRepository.save(game.player1);

    game.player2.status = 'online';
    game.player2.updatedAt = new Date();
    await this.userRepository.save(game.player2);

    //event update status
    this.eventEmitter.emit(
      'user_status.updated',
      new UserUpdateEvent({
        id: game.player1.id,
        status: game.player1.status,
        login: game.player1.login,
      }),
    );

    this.eventEmitter.emit(
      'user_status.updated',
      new UserUpdateEvent({
        id: game.player2.id,
        status: game.player2.status,
        login: game.player2.login,
      }),
    );
    const result: GameInterface = game;
    // console.log('result end game : ', result);
    return result;
  }

  async getAllUserGames(userId: bigint): Promise<GameInterface[]> {
    const games: GameEntity[] = await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.player1', 'player1')
      .leftJoinAndSelect('games.player2', 'player2')
      .leftJoinAndSelect('games.winner', 'winner')
      .select([
        'games',
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
      .andWhere('games.status IN (:...statuses)', {
        statuses: ['finished', 'playing'],
      })
      .orderBy('games.createdAt', 'DESC')
      .getMany();

    const result: GameInterface[] = games;
    // console.log('result get all game : ', result);
    return result;
  }
}
