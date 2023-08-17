import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './entity/game.entity';
import { Game } from './game.class';

import { Repository } from 'typeorm';
import { PlayerStats } from './game.class';

import { UserEntity } from '../users/entity/users.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameInterface, clientUpdate } from './interfaces/game.interface';
import { BadRequestException } from '@nestjs/common';
import { MessageCreateDTO } from '../messagerie/dto/message.create.dto';
import { MessageService } from '../messagerie/messages.service';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationCreateDTO } from '../notification/dto/notification.create.dto';
import { UserUpdateEvent } from '../notification/events/notification.event';
import { TrophiesService } from '../trophies/trophies.service';

const BASE_XP = 20;
interface PlayerInfoPrivateLobby {
  username: string;
  socketId: string;
  gameId: bigint;
  mode: string;
  ready: boolean;
}

export interface GameInfo {
  id: bigint;
  player1Username: string;
  player2Username: string;
  player1Avatar: string;
  player2Avatar: string;
  player1Rank: string;
  player2Rank: string;
  player1Score: number;
  player2Score: number;
}

class PrivateLobby {
  player1: PlayerInfoPrivateLobby;
  player2: PlayerInfoPrivateLobby;
  creationDate: Date;
  gameId: bigint;

  constructor() {
    this.creationDate = new Date();
  }
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

  leaderBoardLimitPerPage = 20;

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
    // private readonly messageRepository: Repository<MessageEntity>,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly trophiesService: TrophiesService,
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
        'error when receiving client update: gameId is not defined',
      );
    }
    if (!this.privatesLobby.has(playerInfo.gameId)) {
      const newLob = new PrivateLobby();
      this.privatesLobby.set(playerInfo.gameId, newLob);
    }
    if (player1 === true) {
      this.privatesLobby.get(playerInfo.gameId).player1 = playerInfo;
    } else {
      this.privatesLobby.get(playerInfo.gameId).player2 = playerInfo;
    }
    if (
      this.privatesLobby.get(playerInfo.gameId).player1?.ready &&
      this.privatesLobby.get(playerInfo.gameId).player2?.ready &&
      !this.checkAlreadyInGame(
        this.privatesLobby.get(playerInfo.gameId).player1.username,
      ) &&
      !this.checkAlreadyInGame(
        this.privatesLobby.get(playerInfo.gameId).player2.username,
      ) &&
      this.privatesLobby.get(playerInfo.gameId).player1?.mode ===
        this.privatesLobby.get(playerInfo.gameId).player2?.mode
    ) {
      this.startNewGame(
        this.privatesLobby.get(playerInfo.gameId).player1.socketId,
        this.privatesLobby.get(playerInfo.gameId).player1.username,
        this.privatesLobby.get(playerInfo.gameId).player2.socketId,
        this.privatesLobby.get(playerInfo.gameId).player2.username,
        this.privatesLobby.get(playerInfo.gameId).player1.mode === 'bonus',
        this.privatesLobby.get(playerInfo.gameId).player1.gameId,
      );
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
        game.player1Stats,
        game.player2Stats,
        game.consecutiveExchangesWithoutBounce,
        game.bonusMode,
      );
      this.games.delete(game.id);
      this.eventEmitter.emit('updateLobbyRoomRequire');
    }
    return game.getState();
  }
  checkAlreadyInGame(username: string): boolean {
    try {
      this.games.forEach(game => {
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
    this.games.forEach(game => {
      if (game.player1Username === username) {
        game.socketPlayer1Id = newSocketId;
      } else if (game.player2Username === username) {
        game.socketPlayer2Id = newSocketId;
      }
    });
  }

  async startNewGame(
    socketId1: string,
    username1: string,
    socketId2: string,
    username2: string,
    bonusMode: boolean,
    gameId?: bigint,
  ): Promise<Game> {
    if (!gameId) {
      let res: GameInterface;
      if (bonusMode) {
        res = await this.saveStartGame(
          username2,
          this.createdWaitingGameBonus.id,
        );
      } else {
        res = await this.saveStartGame(username2, this.createdWaitingGame.id);
      }
      if (!res) throw new BadRequestException('erreur save start game');
      gameId = res.id;
    }

    const user1: UserEntity = await this.userRepository.findOne({
      where: { login: username1 },
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'description',
        'avatar',
        'score',
        'rank',
      ],
    });

    const user2: UserEntity = await this.userRepository.findOne({
      where: { login: username2 },
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'description',
        'avatar',
        'score',
        'rank',
      ],
    });

    this.createdWaitingGameBonus = {} as GameInterface;

    const game: Game = new Game(
      socketId1,
      username1,
      user1,
      socketId2,
      username2,
      user2,
      gameId,
      bonusMode,
      (eventName, data) => this.eventEmitter.emit(eventName, data),
    );
    this.games.set(game.id, game);
    this.eventEmitter.emit('updateLobbyRoomRequire');
    return game;
  }

  getAllGamesInfo(): GameInfo[] {
    const gamesInfo: GameInfo[] = [];
    this.games.forEach(game => {
      gamesInfo.push(game.getInfo());
    });
    return gamesInfo;
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
        this.playerWaiting1Bonus.username !== username
      ) {
        this.playerWaiting2Bonus = {
          socketId: socketId,
          username: username,
        };

        const game = await this.startNewGame(
          this.playerWaiting1Bonus.socketId,
          this.playerWaiting1Bonus.username,
          this.playerWaiting2Bonus.socketId,
          this.playerWaiting2Bonus.username,
          true,
        );
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

        const game = await this.startNewGame(
          this.playerWaiting1Normal.socketId,
          this.playerWaiting1Normal.username,
          this.playerWaiting2Normal.socketId,
          this.playerWaiting2Normal.username,
          false,
        );

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
      relations: ['trophies'],
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
    console.log('newGameCreated : ', newGameCreated);
    console.log('user : ', user);
    console.log('userToInvite : ', userToInvite);

    //create message
    const newBotMessage: MessageCreateDTO = {
      text: `/game?id=${newGameCreated.id}`,
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
    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: roomId },
      relations: ['player1', 'player2'],
    });
    if (!game) throw new BadRequestException('game not found');

    const isPlayer1 = game.player1.id == user.id;
    const isPlayer2 = game.player2.id == user.id;
    if (!isPlayer1 && !isPlayer2)
      throw new BadRequestException('You are not allowed to accept this game');

    if (game.status == 'waiting_start') {
      game.status = 'playing';
      game.updatedAt = new Date();
      const gameUpdated: GameEntity = await this.gameRepository.save(game);
      return gameUpdated;
    }
    if (game.status !== 'waiting')
      throw new BadRequestException('game already started');

    if (game.player1.status === 'in game' || game.player2.status === 'in game')
      throw new BadRequestException('user already in game');

    game.status = 'waiting_start';
    game.updatedAt = new Date();
    const gameUpdated: GameEntity = await this.gameRepository.save(game);

    //event notification
    const newNotif: NotificationEntity =
      await this.notificationService.createNotification({
        type: 'gameInviteAccepted',
        content: `'s challenge accepted, let's play`,
        receiver: {
          id: isPlayer1 ? game.player2.id : game.player1.id,
          login: isPlayer1 ? game.player2.login : game.player1.login,
          avatar: isPlayer1 ? game.player2.avatar : game.player1.avatar,
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

  async saveAcceptGameNoNotif(
    userId: bigint,
    roomId: bigint,
  ): Promise<GameInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('user not found');
    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: roomId },
      relations: ['player1', 'player2'],
    });
    if (!game) throw new BadRequestException('game not found');

    const isPlayer1 = game.player1.id == user.id;
    const isPlayer2 = game.player2.id == user.id;
    if (!isPlayer1 && !isPlayer2)
      throw new BadRequestException('You are not allowed to accept this game');

    if (game.status == 'waiting_start') {
      game.status = 'playing';
      game.updatedAt = new Date();
      const gameUpdated: GameEntity = await this.gameRepository.save(game);
      return gameUpdated;
    }
    if (game.status !== 'waiting')
      throw new BadRequestException('game already started');

    if (game.player1.status === 'in game' || game.player2.status === 'in game')
      throw new BadRequestException('user already in game');

    game.status = 'waiting_start';
    game.updatedAt = new Date();
    const gameUpdated: GameEntity = await this.gameRepository.save(game);

    return gameUpdated;
  }

  async saveDeclineGame(userId: bigint, roomId: bigint): Promise<void> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('user not found');

    const game: GameEntity = await this.gameRepository.findOne({
      where: { id: roomId },
      relations: ['player1', 'player2'],
    });
    if (!game) throw new BadRequestException('game not found');

    if (game.player1.id != user.id && game.player2.id != user.id)
      throw new BadRequestException('You are not allowed to decline this game');

    if (game.status !== 'waiting_start' && game.status !== 'waiting')
      throw new BadRequestException('game already started or no invitation');

    const newNotif: NotificationEntity =
      await this.notificationService.sendNotification({
        type: 'gameInviteDeclined',
        content: `decline challenge`,
        receiver: {
          id: game.status == 'waiting' ? game.player1.id : game.player2.id,
          login:
            game.status == 'waiting' ? game.player1.login : game.player2.login,
          avatar:
            game.status == 'waiting'
              ? game.player1.avatar
              : game.player2.avatar,
        },
        sender: {
          id: user.id,
          login: user.login,
          avatar: user.avatar,
        },
      } as NotificationCreateDTO);
    if (!newNotif) throw new Error('Notification not created');
    // }

    await this.gameRepository.delete({ id: roomId });
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

  async updateGameStatus(
    gameId: bigint,
    winnerId: string,
    scorePlayer1: number,
    scorePlayer2: number,
  ) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player1', 'player2', 'player1.trophies', 'player2.trophies'],
    });

    game.status = 'finished';
    game.finishAt = new Date();
    game.scorePlayer1 = scorePlayer1;
    game.scorePlayer2 = scorePlayer2;
    game.winner = await this.userRepository.findOne({
      where: { login: winnerId },
    });

    const { scoreEloP1, scoreEloP2 } = this.updateEloScore(
      game.player1,
      game.player2,
      game.winner,
    );
    game.eloScorePlayer1 = scoreEloP1 | 0;
    game.eloScorePlayer2 = scoreEloP2 | 0;
    game.player1.experience += game.winner.id == game.player1.id ? 10 : 0;
    game.player2.experience += game.winner.id == game.player2.id ? 10 : 0;
    game.expPlayer1 = game.player1.experience;
    game.expPlayer2 = game.player2.experience;
    game.levelPlayer1 = this.computeLevel(game.expPlayer1);
    game.levelPlayer2 = this.computeLevel(game.expPlayer2);

    await this.gameRepository.save(game);
    return game;
  }

  determineRank(scoreElo: number): string {
    if (scoreElo < 1550) return 'cooper_1';
    if (scoreElo < 1600) return 'cooper_2';
    if (scoreElo < 1650) return 'cooper_3';
    if (scoreElo < 1700) return 'silver_1';
    if (scoreElo < 1800) return 'silver_2';
    if (scoreElo < 1900) return 'silver_3';
    if (scoreElo < 2000) return 'gold_1';
    if (scoreElo < 2200) return 'gold_2';
    if (scoreElo < 2400) return 'gold_3';
    if (scoreElo < 2600) return 'master_1';
    if (scoreElo < 2800) return 'master_2';
    if (scoreElo < 3000) return 'master_3';
  }

  async updatePlayerStats(
    player: UserEntity,
    winnerId: string,
    scoreElo: number,
    playerStats: PlayerStats,
    winWihoutLoseAPoint: boolean,
  ) {
    if (player.login == winnerId) {
      // do not update exp here
      player.level = this.computeLevel(player.experience);
      player.numberOfConsecutiveWins += 1;
      if (winWihoutLoseAPoint) {
        player.numberOfConsecutiveWins += 1;
      }
    } else {
      player.numberOfConsecutiveWins = 0;
    }
    player.bonusUsed += playerStats.numberOfBonusesUsed;
    player.laserKill += playerStats.numberOfLaserKills;
    player.numberOfGamesPlayed += 1;
    player.status = 'online';
    player.score = scoreElo;
    player.updatedAt = new Date();
    await this.userRepository.save(player);
  }

  async saveEndGame(
    gameId: bigint,
    winnerId: string,
    scorePlayer1: number,
    scorePlayer2: number,
    player1Stats: PlayerStats,
    player2Stats: PlayerStats,
    consecutiveExchangesWithoutBounce: number,
    bonusMode: boolean,
  ): Promise<GameInterface> {
    const game = await this.updateGameStatus(
      gameId,
      winnerId,
      scorePlayer1,
      scorePlayer2,
    );

    await this.updatePlayerStats(
      game.player1,
      winnerId,
      game.eloScorePlayer1 | 0,
      player1Stats,
      scorePlayer2 === 0,
    );
    await this.updatePlayerStats(
      game.player2,
      winnerId,
      game.eloScorePlayer2 | 0,
      player2Stats,
      scorePlayer1 === 0,
    );

    await this.trophiesService.updateTrophiesPlayer(
      scorePlayer1,
      scorePlayer2,
      game.player1,
      game,
      player1Stats,
      consecutiveExchangesWithoutBounce,
      bonusMode,
    );
    await this.trophiesService.updateTrophiesPlayer(
      scorePlayer2,
      scorePlayer1,
      game.player2,
      game,
      player2Stats,
      consecutiveExchangesWithoutBounce,
      bonusMode,
    );

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

  async getAllUserGames(
    userId: bigint,
    page: number,
    limit: number,
  ): Promise<GameInterface[]> {
    const games: GameEntity[] = await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.player1', 'player1')
      .leftJoinAndSelect('games.player2', 'player2')
      .leftJoinAndSelect('games.winner', 'winner')
      .select([
        'games',
        'player1.id',
        'player1.score',
        'player1.level',
        'player1.firstName',
        'player1.lastName',
        'player1.login',
        'player1.avatar',
        'player2.id',
        'player2.score',
        'player2.level',
        'player2.firstName',
        'player2.lastName',
        'player2.login',
        'player2.avatar',
        'winner.id',
        'winner.firstName',
        'winner.lastName',
        'winner.login',
      ])
      .where('(player1.id = :userId OR player2.id = :userId)', { userId })
      .andWhere('games.status IN (:...statuses)', {
        statuses: ['finished'],
      })
      .orderBy('games.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const result: GameInterface[] = games;
    return result;
  }

  async getStatsUser(userId: bigint): Promise<any> {
    const games: GameEntity[] = await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.player1', 'player1')
      .leftJoinAndSelect('games.player2', 'player2')
      .where(
        '(games.player1.id = :userId OR games.player2.id = :userId) AND games.status = :status',
        {
          userId,
          status: 'finished',
        },
      )
      .orderBy('games.createdAt', 'ASC')
      .getMany();
    const stats = games.map(game => {
      const isPlayer1 = game.player1.id == userId;
      return {
        score: isPlayer1 ? game.scorePlayer1 : game.scorePlayer2,
        eloscore: isPlayer1 ? game.eloScorePlayer1 : game.eloScorePlayer2,
        exp: isPlayer1 ? game.expPlayer1 : game.expPlayer2,
        level: isPlayer1 ? game.levelPlayer1 : game.levelPlayer2,
        win: isPlayer1 ? game.scorePlayer1 > game.scorePlayer2 : false,
      };
    });

    return stats;
  }

  async countAllGames(userId: bigint): Promise<number> {
    const count = await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.player1', 'player1')
      .leftJoinAndSelect('games.player2', 'player2')
      .where(
        '(games.player1.id = :userId OR games.player2.id = :userId) AND games.status = :status',
        {
          userId,
          status: 'finished',
        },
      )
      .getCount();
    return count;
  }

  /** **********************
   *       ELO SCORE
   * *********************** */

  // https://fr.wikipedia.org/wiki/Classement_Elo

  //    Rn = Ro + K * (S - Se)
  // Où :

  // Rn est le nouveau classement ELO
  // Ro est l'ancien classement ELO (avant le match)
  // K est un coefficient défini qui représente l'importance du match (généralement, c'est 32 pour les échecs)
  // S est le score réel (1 pour une victoire, 0.5 pour une égalité, 0 pour une défaite)
  // Se est le score attendu
  // Le score attendu est calculé avec cette formule :

  // Se = 1 / (1 + 10^((Rb-Ra) / 400))
  // Où :

  // Rb est le classement ELO de l'adversaire
  // Ra est votre propre classement ELO

  updateEloScore(
    player1: UserEntity,
    player2: UserEntity,
    winner: UserEntity,
  ): { scoreEloP1: number; scoreEloP2: number } {
    const k = 32;
    const scoreEloP1 = player1.score;
    const scoreEloP2 = player2.score;
    const expectedScoreP1 =
      1 / (1 + Math.pow(10, (scoreEloP2 - scoreEloP1) / 400));
    const expectedScoreP2 =
      1 / (1 + Math.pow(10, (scoreEloP1 - scoreEloP2) / 400));
    let newScoreEloP1 = scoreEloP1;
    let newScoreEloP2 = scoreEloP2;

    if (winner.id === player1.id) {
      newScoreEloP1 = scoreEloP1 + k * (1 - expectedScoreP1);
      newScoreEloP2 = scoreEloP2 + k * (0 - expectedScoreP2);
    } else if (winner.id === player2.id) {
      newScoreEloP1 = scoreEloP1 + k * (0 - expectedScoreP1);
      newScoreEloP2 = scoreEloP2 + k * (1 - expectedScoreP2);
    }
    return { scoreEloP1: newScoreEloP1, scoreEloP2: newScoreEloP2 };
  }

  computeLevel(xp: number) {
    let level = 1;
    while (xp >= BASE_XP * level) {
      xp -= BASE_XP * level;
      level++;
    }
    return level;
  }
}
