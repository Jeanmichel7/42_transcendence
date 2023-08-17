import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';

import { JwtService } from '@nestjs/jwt';
import { TrophiesEntity } from './entity/trophies.entity';
import { TrophiesService } from './trophies.service';
import { GameEntity } from '../game/entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { TrophiesController } from './trophies.controller';
import { UserTrophiesEntity } from './entity/userTrophiesProgress.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameEntity,
      UserEntity,
      NotificationEntity,
      TrophiesEntity,
      UserTrophiesEntity,
    ]),
  ],
  controllers: [TrophiesController],
  providers: [JwtService, TrophiesService, NotificationService, UsersService],
  exports: [TrophiesService],
})
export class TrophieModule {}
