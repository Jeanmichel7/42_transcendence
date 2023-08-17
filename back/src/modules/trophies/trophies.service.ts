import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrophiesEntity } from './entity/trophies.entity';
import { GameEntity } from '../game/entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
import { PlayerStats } from '../game/game.class';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { NotificationCreateDTO } from '../notification/dto/notification.create.dto';
import { UserTrophiesEntity } from './entity/userTrophiesProgress.entity';
import { trophies } from './trophies.data';

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
    private readonly notificationService: NotificationService
  ) {
    this.initializeTrophies();
    this.initializeTrophiesProgress();
  }

  async createTrophy(
    name: string,
    description: string,
    path: string,
    total: number
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
      for (const trophy of trophies) {
        await this.createTrophy(
          trophy.name,
          trophy.description,
          trophy.imagePath,
          trophy.total
        );
      }
    }
  }

  async initializeTrophiesProgress(): Promise<void> {
    const count = await this.userTrophiesProgressRepository.count();

    if (count === 0) {
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
    bonusMode: boolean
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
    if (player.numberOfGamesPlayed >= 1) {
      trophyNamesToAssign.push('Beginner');
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
    if (
      playerScore > opponentScore &&
      this.calculDuration(game.createdAt, game.finishAt) <= 120
    ) {
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

    let trophiesToAssign: TrophiesEntity[] = await Promise.all(
      trophyNamesToAssign.map(async name => {
        const trophy = await this.getTrophyByName(name);
        return trophy;
      })
    );

    trophiesToAssign = trophiesToAssign.filter(trophy => trophy !== null);
    const trophiesToAdd = trophiesToAssign?.filter(trophy => {
      return !player.trophies?.some(
        playerTrophy => playerTrophy.id === trophy.id
      );
    });

    const trophyNamesToCheck: string[] = trophies.map(t => t.name);
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
      if (player.trophies?.some(t => t.id === trophy.id)) continue;
      switch (trophyName) {
        case 'Beginner':
          userTrophyProgress.progress =
            player.numberOfGamesPlayed > userTrophyProgress.progress
              ? player.numberOfGamesPlayed
              : userTrophyProgress.progress;
          break;
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
              `Can't create notification for user ${player.login}`
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
