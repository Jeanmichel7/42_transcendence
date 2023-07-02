import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entity/game.entity';
import { Game } from './game.class';

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
import { GameInterface, clientUpdate } from './interfaces/game.interface';
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
import { threadId } from 'worker_threads';

interface PlayerInfoPrivateLobby {
  username: string;
  socketId: string;
  gameId: bigint;
  mode: string;
  ready: boolean;
}

class PrivateLobby {
  player1: PlayerInfoPrivateLobby;
  player2: PlayerInfoPrivateLobby;
  creationDate: Date;
  gameId: bigint;
}

@Injectable()
export class GameService {
  games: Map<bigint, Game>;
  privatesLobby: Map<bigint, PrivateLobby>;
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
    this.privatesLobby = new Map<bigint, PrivateLobby>();
  }

  /** **********************
   *        YANN PART
   *********************** */

  updatePrivateLobby(player1: boolean, playerInfo: PlayerInfoPrivateLobby) {
    if (!playerInfo.gameId) {
      console.error(
        'Error when receiving client update: gameId is not defined',
      );
    }
    if (!this.privatesLobby.has(playerInfo.gameId)) {
      let newLob = new PrivateLobby();
      this.privatesLobby.set(playerInfo.gameId, newLob);
    }
    if (player1 === true) {
      console.log('player1 UPDATE', playerInfo);
      this.privatesLobby.get(playerInfo.gameId).player1 = playerInfo;
    } else {
      console.log('player2 UPDATE', playerInfo);
      this.privatesLobby.get(playerInfo.gameId).player2 = playerInfo;
    }
    if (
      this.privatesLobby.get(playerInfo.gameId).player1?.ready &&
      this.privatesLobby.get(playerInfo.gameId).player2?.ready &&
      this.privatesLobby.get(playerInfo.gameId).player1?.mode ===
        this.privatesLobby.get(playerInfo.gameId).player2?.mode
    ) {
      console.log(
        'player1username',
        this.privatesLobby.get(playerInfo.gameId).player1.username,
      );
      console.log(
        'player2username',
        this.privatesLobby.get(playerInfo.gameId).player2.username,
      );
      const game = new Game(
        this.privatesLobby.get(playerInfo.gameId).player1.socketId,
        this.privatesLobby.get(playerInfo.gameId).player1.username,
        this.privatesLobby.get(playerInfo.gameId).player2.socketId,
        this.privatesLobby.get(playerInfo.gameId).player2.username,
        this.privatesLobby.get(playerInfo.gameId).gameId,
        this.privatesLobby.get(playerInfo.gameId).player1.mode === 'bonus',
      );
      this.games.set(this.privatesLobby.get(playerInfo.gameId).gameId, game);
      return true;
    }
  }

  getOtherPlayerSockerId(gameId: bigint, player1: boolean): string {
    if (this.privatesLobby.has(gameId)) {
      if (player1 === true) {
        return this.privatesLobby.get(gameId).player2?.socketId;
      } else {
        return this.privatesLobby.get(gameId).player1?.socketId;
      }
    }
  }
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
        game.socketPlayer1Id = newSocketId;
      } else if (game.player2Username === username) {
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
      } else if (
        this.playerWaiting2Bonus === undefined &&
        this.playerWaiting1Bonus !== username
      ) {
        this.playerWaiting2Bonus = {
          socketId: socketId,
          username: username,
        };
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
      if (this.playerWaiting1Normal === undefined) {
        this.playerWaiting1Normal = {
          socketId: socketId,
          username: username,
        };
        // createdWaitingGame
        this.createdWaitingGame = await this.saveCreateWaitingGame(
          this.playerWaiting1Normal.username,
        );
      } else if (
        this.playerWaiting2Normal === undefined &&
        this.playerWaiting1Normal.username !== username
      ) {
        this.playerWaiting2Normal = {
          socketId: socketId,
          username: username,
        };

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
    } else if (this.playerWaiting1Bonus?.username === Username) {
      this.playerWaiting1Bonus = undefined;
      this.saveCancelWaitingGame(this.createdWaitingGameBonus.id);
      this.createdWaitingGameBonus = {} as GameInterface;
    }
  }

  updateClientData(clientData: clientUpdate, clientId: string) {
    if (clientData.gameId)
      this.games.get(clientData.gameId)?.updateGameData(clientData, clientId);
  }

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

    //create message
    const newBotMessage: MessageCreateDTO = {
      text: `Invitation Game http://localhost:3006/game?id=${newGameCreated.id}`,
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
        content: `${user.login} challenges you}`,
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
    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: roomId },
      relations: ['player1', 'player2'],
    });
    if (!game) throw new BadRequestException('game not found');

    if (game.status !== 'waiting')
      throw new BadRequestException('game already started');

    if (game.player2.id != user.id)
      throw new BadRequestException('You are not allowed to accept this game');

    game.status = 'waiting_start';
    game.updatedAt = new Date();
    const gameUpdated: GameEntity = await this.gameRepository.save(game);

    //event notification
    const newNotif: NotificationEntity =
      await this.notificationService.createNotification({
        type: 'gameInviteAccepted',
        content: `${user.login} accept challenge, let's play`,
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
        content: `${user.login} decline challenge`,
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

    const player2 = await this.userRepository.findOne({
      where: { login: userlogin2 },
    });
    if (!player2) throw new NotFoundException('player2 not found');

    findWaitingGame.player2 = player2;
    findWaitingGame.status = 'playing';
    findWaitingGame.updatedAt = new Date();

    const test: GameEntity = await this.gameRepository.save(findWaitingGame);
    const result: GameInterface = test;
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
    });
    game.status = 'finished';
    game.finishAt = new Date();
    game.scorePlayer1 = scorePlayer1;
    game.scorePlayer2 = scorePlayer2;
    game.winner = await this.userRepository.findOne({
      where: { login: winnerId },
    });
    await this.gameRepository.save(game);

    const result: GameInterface = game;
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
      .orderBy('games.createdAt', 'DESC')
      .getMany();

    const result: GameInterface[] = games;
    return result;
  }
}
