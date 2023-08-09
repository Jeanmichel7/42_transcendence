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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrophiesEntity,
      GameEntity,
      UserEntity,
      NotificationEntity,
    ]),
  ],
  providers: [JwtService, TrophiesService, NotificationService],
  exports: [TrophiesService],
})
export class TrophieModule {}
