import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrophiesEntity } from './entity/trophies.entity'; // Assurez-vous que le chemin est correct
import { GameEntity } from '../game/entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
import { PlayerStats } from '../game/game.class';

const trophies = [
  [
    {
      name: 'Warrior',
      description: 'Win 3 games in a row',
      imagePath: '../../assets/warrior.jpeg',
    },
    {
      name: 'Lord',
      description: 'Win 5 games in a row',
      imagePath: '../../assets/lord.jpeg',
    },
    {
      name: 'Emperor',
      description: 'Win 10 games in a row',
      imagePath: '../../assets/emperor.jpeg',
    },
    {
      name: 'Laser Pointer',
      description: 'Kill an opponent with a Laser',
      imagePath: '../../assets/laser_pointer.jpeg',
    },
    {
      name: 'Gamma Laser',
      description: 'Kill 5 opponents with a laser',
      imagePath: '../../assets/gamma_laser.jpeg',
    },
    {
      name: 'Scorificator',
      description: 'Kill 10 opponents with a laser',
      imagePath: '../../assets/scorificator.jpeg',
    },
    {
      name: 'Regular',
      description: 'Play 20 games',
      imagePath: '../../assets/regular.jpeg',
    },
    {
      name: 'Addict',
      description: 'Play 50 games',
      imagePath: '../../assets/addict.jpeg',
    },
    {
      name: 'NoLife',
      description: 'Play 100 games',
      imagePath: '../../assets/nolife.jpeg',
    },
    {
      name: 'Bonus Master',
      description: 'Use 3 bonuses in one game',
      imagePath: '../../assets/bonus_master.jpeg',
    },
    {
      name: 'Bonus Pro',
      description: 'Use 5 bonuses in one game',
      imagePath: '../../assets/bonus_pro.jpeg',
    },
    {
      name: 'Bonus Cheater',
      description: 'Use 10 bonuses in one game',
      imagePath: '../../assets/bonus_cheater.jpeg',
    },
    {
      name: 'Pong-tastic',
      description: 'Win 5 games without missing a single ball',
      imagePath: '../../assets/pong_tastic.jpeg',
    },
    {
      name: 'Tireless Returner',
      description:
        'Return the ball 10 times in a row without it touching the sides',
      imagePath: '../../assets/tireless_returner.jpeg',
    },
    {
      name: 'Why Not',
      description: 'Win a bonus game without using any bonuses',
      imagePath: '../../assets/why_not.jpeg',
    },
    {
      name: 'Ping King',
      description: 'Score a point when the ball is at high speed',
      imagePath: '../../assets/ping_king.jpeg',
    },
    {
      name: 'Faster Than Light',
      description: 'Score a point when the ball is at maximum speed',
      imagePath: '../../assets/faster_than_light.jpeg',
    },
    {
      name: 'Blitz Pong',
      description: 'Win a game in less than 2 minutes',
      imagePath: '../../assets/blitz_pong.jpeg',
    },
    {
      name: 'Invincible Resistant',
      description: 'Win a game without losing a single point',
      imagePath: '../../assets/invincible_resistant.jpeg',
    },
    {
      name: 'Point Prospector',
      description: 'Win a game with a minimum of 30 points scored',
      imagePath: '../../assets/point_prospector.jpeg',
    },
  ],
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
  ) {}

  async createTrophy(
    name: string,
    description: string,
  ): Promise<TrophiesEntity> {
    const newTrophy = new TrophiesEntity();
    newTrophy.name = name;
    newTrophy.description = description;
    return await this.trophyRepository.save(newTrophy);
  }
  async initializeTrophies(): Promise<void> {
    const count = await this.trophyRepository.count();

    if (count === 0) {
      console.log(
        "Trophies table doesn't exist... Creating trophies table in dataBase/",
      );
      for (const trophy of trophies) {
        await this.createTrophy(trophy.name, trophy.description);
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
    if (playerStats.numberOfBonusesUsed === 0) {
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
      trophyNamesToAssign.push('Laser Gamma');
    }
    if (playerStats.numberOfLaserKills >= 10) {
      trophyNamesToAssign.push('Scorificator');
    }
    if (playerStats.maxSpeedScoring >= 50) {
      trophyNamesToAssign.push('King of Ping');
    }
    if (playerStats.maxSpeedScoring >= 200) {
      trophyNamesToAssign.push('Faster than Light');
    }
    if (consecutiveExchangesWithoutBounce >= 10) {
      trophyNamesToAssign.push('Relentless Returner');
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
      trophyNamesToAssign.push('Prospector of Points');
    }
    if (opponentScore == 0) {
      trophyNamesToAssign.push('Invincible Resistor');
    }
    if (player.numberOfGamesWonWithoutMissingBall >= 5) {
      trophyNamesToAssign.push('Pong-tastic');
    }
    // Récupérez les trophées par leurs noms
    const trophiesToAssign: TrophiesEntity[] = await Promise.all(
      trophyNamesToAssign.map((name) => this.getTrophyByName(name)),
    );

    // Filtrer les trophées que le joueur possède déjà
    const trophiesToAdd = trophiesToAssign.filter(
      (trophy) =>
        !player.trophies.some((playerTrophy) => playerTrophy.id === trophy.id),
    );

    // Ajouter les trophées au joueur
    if (trophiesToAdd.length > 0) {
      player.trophies = [...(player.trophies || []), ...trophiesToAdd];
      await this.userRepository.save(player);
    }
  }
}
