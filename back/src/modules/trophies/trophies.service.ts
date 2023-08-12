import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrophiesEntity } from './entity/trophies.entity'; // Assurez-vous que le chemin est correct
import { GameEntity } from '../game/entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
import { PlayerStats } from '../game/game.class';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { NotificationCreateDTO } from '../notification/dto/notification.create.dto';
import { UserTrophiesEntity } from './entity/userTrophiesProgress.entity';

const trophies = [
  {
    name: 'Warrior',
    description: 'Win 3 games in a row',
    imagePath: 'warrior.jpeg',
    total: 3,
  },
  {
    name: 'Lord',
    description: 'Win 5 games in a row',
    imagePath: 'lord.jpeg',
    progress: 0,
    total: 5,
  },
  {
    name: 'Emperor',
    description: 'Win 10 games in a row',
    imagePath: 'emperor.jpeg',
    progress: 0,
    total: 10,
  },
  {
    name: 'Laser Pointer',
    description: 'Kill an opponent with a Laser',
    imagePath: 'laser_pointer.jpeg',
  },
  {
    name: 'Gamma Laser',
    description: 'Kill 5 opponents with a laser',
    imagePath: 'gamma_laser.jpeg',
    progress: 0,
    total: 5,
  },
  {
    name: 'Scorificator',
    description: 'Kill 10 opponents with a laser',
    imagePath: 'scorificator.jpeg',
    progress: 0,
    total: 10,
  },
  {
    name: 'Regular',
    description: 'Play 20 games',
    imagePath: 'regular.jpeg',
    progress: 0,
    total: 20,
  },
  {
    name: 'Addict',
    description: 'Play 50 games',
    imagePath: 'addict.jpeg',
    progress: 0,
    total: 50,
  },
  {
    name: 'NoLife',
    description: 'Play 100 games',
    imagePath: 'nolife.jpeg',
    progress: 0,
    total: 100,
  },
  {
    name: 'Bonus Master',
    description: 'Use 3 bonuses in one game',
    imagePath: 'bonus_master.jpeg',
    progress: 0,
    total: 3,
  },
  {
    name: 'Bonus Pro',
    description: 'Use 5 bonuses in one game',
    imagePath: 'bonus_pro.jpeg',
    progress: 0,
    total: 5,
  },
  {
    name: 'Bonus Cheater',
    description: 'Use 10 bonuses in one game',
    imagePath: 'bonus_cheater.jpeg',
    progress: 0,
    total: 10,
  },
  {
    name: 'Pong-tastic',
    description: 'Win 5 games without missing a single ball',
    imagePath: 'pong_tastic.jpeg',
    progress: 0,
    total: 5,
  },
  {
    name: 'Tireless Returner',
    description:
      'Return the ball 10 times in a row without it touching the sides',
    imagePath: 'tireless_returner.jpeg',
    progress: 0,
    total: 10,
  },
  {
    name: 'Why Not',
    description: 'Win a bonus game without using any bonuses',
    imagePath: 'why_not.jpeg',
  },
  {
    name: 'Ping King',
    description: 'Score a point when the ball is at high speed',
    imagePath: 'ping_king.jpeg',
  },
  {
    name: 'Faster Than Light',
    description: 'Score a point when the ball is at maximum speed',
    imagePath: 'faster_than_light.jpeg',
  },
  {
    name: 'Blitz Pong',
    description: 'Win a game in less than 2 minutes',
    imagePath: 'blitz_pong.jpeg',
  },
  {
    name: 'Invincible Resistant',
    description: 'Win a game without losing a single point',
    imagePath: 'invincible_resistant.jpeg',
  },
  {
    name: 'Point Prospector',
    description: 'Win a game with a minimum of 30 points scored',
    imagePath: 'point_prospector.jpeg',
    progress: 0,
    total: 30,
  },
];

@Injectable()
export class TrophiesService {
  constructor(
    @InjectRepository(TrophiesEntity)
    private readonly trophyRepository: Repository<TrophiesEntity>,
    @InjectRepository(UserTrophiesEntity)
    private readonly userTrophiesProgressRepository: Repository<UserTrophiesEntity>,
    // @InjectRepository(GameEntity)
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    // private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {
    this.initializeTrophies();
    this.initializeTrophiesProgress();
  }

  async createTrophy(
    name: string,
    description: string,
    path: string,
    total: number,
  ): Promise<TrophiesEntity> {
    const newTrophy = new TrophiesEntity();
    newTrophy.name = name;
    newTrophy.description = description;
    newTrophy.imagePath = path;
    newTrophy.total = total;
    return await this.trophyRepository.save(newTrophy);
  }

  async initializeTrophies(): Promise<void> {
    const count = await this.trophyRepository.count();

    if (count === 0) {
      console.log(
        "Trophies table doesn't exist... Creating trophies table in dataBase/",
      );
      for (const trophy of trophies) {
        await this.createTrophy(
          trophy.name,
          trophy.description,
          trophy.imagePath,
          trophy.total,
        );
      }
    }
  }

  async initializeTrophiesProgress(): Promise<void> {
    const count = await this.userTrophiesProgressRepository.count();

    if (count === 0) {
      console.log(
        "UserTrophiesProgress table doesn't exist... Creating table in dataBase/",
      );
      const users = await this.userRepository.find();
      for (const user of users) {
        for (const trophy of trophies) {
          const newTrophy = new UserTrophiesEntity();
          newTrophy.trophy = await this.getTrophyByName(trophy.name);
          newTrophy.user = user;
          newTrophy.progress = trophy.progress || 0;
          newTrophy.total = trophy.total || 0;
          await this.userTrophiesProgressRepository.save(newTrophy);
        }
      }
    }
  }

  // async assignTrophyToPlayer(
  //   player: UserEntity,
  //   trophy: TrophiesEntity,
  // ): Promise<void> {
  //   player.trophies = [...(player.trophies || []), trophy];
  //   await this.userRepository.save(player);
  // }

  async getTrophyByName(name: string): Promise<TrophiesEntity | null> {
    return await this.trophyRepository.findOne({ where: { name } });
  }

  calculDuration(dateStart: Date, dateEnd: Date): number {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diff / 1000);
  }

  async updateTrophiesPlayer(
    playerScore: number,
    opponentScore: number,
    player: UserEntity,
    game: GameEntity,
    playerStats: PlayerStats,
    consecutiveExchangesWithoutBounce: number,
    bonusMode: boolean,
  ): Promise<void> {
    const trophyNamesToAssign: string[] = [];
    if (playerStats.numberOfBonusesUsed >= 3) {
      trophyNamesToAssign.push('Bonus Master');
    }
    if (playerStats.numberOfBonusesUsed >= 5) {
      trophyNamesToAssign.push('Bonus Pro');
    }
    if (playerStats.numberOfBonusesUsed >= 10) {
      trophyNamesToAssign.push('Bonus Cheater');
    }
    if (playerStats.numberOfBonusesUsed === 0 && bonusMode) {
      trophyNamesToAssign.push('Why Not');
    }
    if (player.numberOfConsecutiveWins >= 3) {
      trophyNamesToAssign.push('Warrior');
    }
    if (player.numberOfConsecutiveWins >= 5) {
      trophyNamesToAssign.push('Lord');
    }
    if (player.numberOfConsecutiveWins >= 10) {
      trophyNamesToAssign.push('Emperor');
    }
    if (playerStats.numberOfLaserKills >= 1) {
      trophyNamesToAssign.push('Laser Pointer');
    }
    if (playerStats.numberOfLaserKills >= 5) {
      trophyNamesToAssign.push('Gamma Laser');
    }
    if (playerStats.numberOfLaserKills >= 10) {
      trophyNamesToAssign.push('Scorificator');
    }
    if (playerStats.maxSpeedScoring >= 50) {
      trophyNamesToAssign.push('Ping King');
    }
    if (playerStats.maxSpeedScoring >= 200) {
      trophyNamesToAssign.push('Faster Than Light');
    }
    if (consecutiveExchangesWithoutBounce >= 10) {
      trophyNamesToAssign.push('Tireless Returner');
    }
    if (player.numberOfGamesPlayed >= 20) {
      trophyNamesToAssign.push('Regular');
    }
    if (player.numberOfGamesPlayed >= 50) {
      trophyNamesToAssign.push('Addict');
    }
    if (player.numberOfGamesPlayed >= 100) {
      trophyNamesToAssign.push('NoLife');
    }
    if (this.calculDuration(game.createdAt, game.finishAt) <= 120) {
      trophyNamesToAssign.push('Blitz Pong');
    }
    if (playerScore >= 30) {
      trophyNamesToAssign.push('Point Prospector');
    }
    if (opponentScore == 0) {
      trophyNamesToAssign.push('Invincible Resistant');
    }
    if (player.numberOfGamesWonWithoutMissingBall >= 5) {
      trophyNamesToAssign.push('Pong-tastic');
    }
    // console.log('trophyNamesToAssign', trophyNamesToAssign);
    // Récupérez les trophées par leurs noms
    let trophiesToAssign: TrophiesEntity[] = await Promise.all(
      trophyNamesToAssign.map(async (name) => {
        const trophy = await this.getTrophyByName(name);
        return trophy;
      }),
    );

    // Filtrer les trophées que le joueur possède déjà
    // console.log('trophiesToAssign', trophiesToAssign);
    trophiesToAssign = trophiesToAssign.filter((trophy) => trophy !== null);
    const trophiesToAdd = trophiesToAssign?.filter((trophy) => {
      return !player.trophies?.some(
        (playerTrophy) => playerTrophy.id === trophy.id,
      );
    });
    // console.log('trophiesToAdd', trophiesToAdd);
    // console.log('trophiesPlayer', player.trophies);
    // console.log('playerId', player.id);

    const trophyNamesToCheck: string[] = trophies.map((t) => t.name);

    for (const trophyName of trophyNamesToCheck) {
      const trophy = await this.getTrophyByName(trophyName);
      if (!trophy || trophy.total == 0) continue;

      const userTrophyProgress =
        await this.userTrophiesProgressRepository.findOne({
          where: {
            user: { id: player.id },
            trophy: { id: trophy.id },
          },
        });

      if (!userTrophyProgress) continue;
      if (player.trophies?.some((t) => t.id === trophy.id)) continue;
      console.log('userTrophyProgress', userTrophyProgress);
      console.log('trophyName', trophyName);
      console.log('user : ', player);
      switch (trophyName) {
        case 'Warrior':
          userTrophyProgress.progress =
            player.numberOfConsecutiveWins > userTrophyProgress.progress
              ? player.numberOfConsecutiveWins
              : userTrophyProgress.progress;
          break;
        case 'Lord':
          userTrophyProgress.progress =
            player.numberOfConsecutiveWins > userTrophyProgress.progress
              ? player.numberOfConsecutiveWins
              : userTrophyProgress.progress;
          break;
        case 'Emperor':
          userTrophyProgress.progress =
            player.numberOfConsecutiveWins > userTrophyProgress.progress
              ? player.numberOfConsecutiveWins
              : userTrophyProgress.progress;
          break;
        case 'Gamma Laser':
          userTrophyProgress.progress =
            playerStats.numberOfLaserKills > userTrophyProgress.progress
              ? playerStats.numberOfLaserKills
              : userTrophyProgress.progress;
          break;
        case 'Scorificator':
          userTrophyProgress.progress =
            playerStats.numberOfLaserKills > userTrophyProgress.progress
              ? playerStats.numberOfLaserKills
              : userTrophyProgress.progress;
          break;
        case 'Regular':
          userTrophyProgress.progress =
            player.numberOfGamesPlayed > userTrophyProgress.progress
              ? player.numberOfGamesPlayed
              : userTrophyProgress.progress;
          break;
        case 'Addict':
          userTrophyProgress.progress =
            player.numberOfGamesPlayed > userTrophyProgress.progress
              ? player.numberOfGamesPlayed
              : userTrophyProgress.progress;
          break;
        case 'NoLife':
          userTrophyProgress.progress =
            player.numberOfGamesPlayed > userTrophyProgress.progress
              ? player.numberOfGamesPlayed
              : userTrophyProgress.progress;
          break;
        case 'Bonus Master':
          userTrophyProgress.progress =
            playerStats.numberOfBonusesUsed > userTrophyProgress.progress
              ? playerStats.numberOfBonusesUsed
              : userTrophyProgress.progress;
          break;
        case 'Bonus Pro':
          userTrophyProgress.progress =
            playerStats.numberOfBonusesUsed > userTrophyProgress.progress
              ? playerStats.numberOfBonusesUsed
              : userTrophyProgress.progress;
          break;
        case 'Bonus Cheater':
          userTrophyProgress.progress =
            playerStats.numberOfBonusesUsed > userTrophyProgress.progress
              ? playerStats.numberOfBonusesUsed
              : userTrophyProgress.progress;
          break;
        case 'Point Prospector':
          userTrophyProgress.progress =
            playerScore > userTrophyProgress.progress
              ? playerScore
              : userTrophyProgress.progress;
          break;
        case 'Tireless Returner':
          userTrophyProgress.progress =
            consecutiveExchangesWithoutBounce > userTrophyProgress.progress
              ? consecutiveExchangesWithoutBounce
              : userTrophyProgress.progress;
          break;
        case 'Point Prospector':
          userTrophyProgress.progress =
            playerScore > userTrophyProgress.progress
              ? playerScore
              : userTrophyProgress.progress;
          break;
        case 'Pong-tastic':
          userTrophyProgress.progress =
            player.numberOfGamesWonWithoutMissingBall >
            userTrophyProgress.progress
              ? player.numberOfGamesWonWithoutMissingBall
              : userTrophyProgress.progress;
          break;
      }

      // Save updated trophy progress
      await this.userTrophiesProgressRepository.save(userTrophyProgress);

      // Ajouter les trophées au joueur
      if (trophiesToAdd && trophiesToAdd.length > 0) {
        player.trophies = [...(player.trophies || []), ...trophiesToAdd];
        await this.userRepository.save(player);

        const bot: UserEntity = await this.userRepository.findOne({
          where: { login: 'bot' },
        });

        for (const trophy of trophiesToAdd) {
          const newNotif: NotificationEntity =
            await this.notificationService.sendNotification({
              type: 'trophy',
              content: `You win a trophy : ${trophy.name}`,
              receiver: player,
              sender: bot,
            } as NotificationCreateDTO);

          if (!newNotif)
            throw new InternalServerErrorException(
              `Can't create notification for user ${player.login}`,
            );
        }
      }
    }
  }

  async getAllTrophies(): Promise<TrophiesEntity[]> {
    const trophies = await this.trophyRepository.find({
      order: { name: 'ASC' },
    });
    return trophies;
  }

  async getUserTrophies(login: string): Promise<TrophiesEntity[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.trophies', 'trophies')
      .where('user.login = :login', { login })
      .orderBy('trophies.name', 'ASC')
      .getOne();

    if (user && user.trophies) {
      return user.trophies;
    }
    return [];
  }
}
