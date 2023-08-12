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

const trophies = [
  {
    name: 'Warrior',
    description: 'Win 3 games in a row',
    imagePath: 'warrior.jpeg',
  },
  {
    name: 'Lord',
    description: 'Win 5 games in a row',
    imagePath: 'lord.jpeg',
  },
  {
    name: 'Emperor',
    description: 'Win 10 games in a row',
    imagePath: 'emperor.jpeg',
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
  },
  {
    name: 'Scorificator',
    description: 'Kill 10 opponents with a laser',
    imagePath: 'scorificator.jpeg',
  },
  {
    name: 'Regular',
    description: 'Play 20 games',
    imagePath: 'regular.jpeg',
  },
  {
    name: 'Addict',
    description: 'Play 50 games',
    imagePath: 'addict.jpeg',
  },
  {
    name: 'NoLife',
    description: 'Play 100 games',
    imagePath: 'nolife.jpeg',
  },
  {
    name: 'Bonus Master',
    description: 'Use 3 bonuses in one game',
    imagePath: 'bonus_master.jpeg',
  },
  {
    name: 'Bonus Pro',
    description: 'Use 5 bonuses in one game',
    imagePath: 'bonus_pro.jpeg',
  },
  {
    name: 'Bonus Cheater',
    description: 'Use 10 bonuses in one game',
    imagePath: 'bonus_cheater.jpeg',
  },
  {
    name: 'Pong-tastic',
    description: 'Win 5 games without missing a single ball',
    imagePath: 'pong_tastic.jpeg',
  },
  {
    name: 'Tireless Returner',
    description:
      'Return the ball 10 times in a row without it touching the sides',
    imagePath: 'tireless_returner.jpeg',
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
  },
];

@Injectable()
export class TrophiesService {
  constructor(
    @InjectRepository(TrophiesEntity)
    private readonly trophyRepository: Repository<TrophiesEntity>,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async createTrophy(
    name: string,
    description: string,
    path: string,
  ): Promise<TrophiesEntity> {
    const newTrophy = new TrophiesEntity();
    newTrophy.name = name;
    newTrophy.description = description;
    newTrophy.imagePath = path;

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
        );
      }
    }
  }

  async assignTrophyToPlayer(
    player: UserEntity,
    trophy: TrophiesEntity,
  ): Promise<void> {
    player.trophies = [...(player.trophies || []), trophy];
    await this.userRepository.save(player);
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
    if (player.gamesPlayed >= 20) {
      trophyNamesToAssign.push('Regular');
    }
    if (player.gamesPlayed >= 50) {
      trophyNamesToAssign.push('Addict');
    }
    if (player.gamesPlayed >= 100) {
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
    console.log('trophyNamesToAssign', trophyNamesToAssign);
    // Récupérez les trophées par leurs noms
    let trophiesToAssign: TrophiesEntity[] = await Promise.all(
      trophyNamesToAssign.map(async (name) => {
        const trophy = await this.getTrophyByName(name);
        return trophy;
      }),
    );

    // Filtrer les trophées que le joueur possède déjà
    console.log('trophiesToAssign', trophiesToAssign);
    trophiesToAssign = trophiesToAssign.filter((trophy) => trophy !== null);
    const trophiesToAdd = trophiesToAssign?.filter((trophy) => {
      return !player.trophies?.some(
        (playerTrophy) => playerTrophy.id === trophy.id,
      );
    });
    console.log('trophiesToAdd', trophiesToAdd);
    console.log('trophiesPlayer', player.trophies);
    console.log('playerId', player.id);

    // Ajouter les trophées au joueur
    if (trophiesToAdd && trophiesToAdd.length > 0) {
      player.trophies = [...(player.trophies || []), ...trophiesToAdd];
      await this.userRepository.save(player);

      console.log('trophe to add', trophiesToAdd);

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
      // await this.notificationService.sendNotification({
      //   type: 'trophy',
      //   content: `You win a trophy : ${trophiesToAdd[0].name}`,
      //   receiver: player,
      //   sender: bot,
      // } as NotificationCreateDTO);

      // //notif trophées
      // this.eventEmitter.emit(
      //   'message.updated',
      //   new NotificationCreatedEvent({
      //     ...messageToUpdate,
      //     text: newMessage.text,
      //     updatedAt: new Date(),
      //   }),
      // );
    }
  }
}
