import { Module } from '@nestjs/common';
import { GameEvents } from './game.event';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
// import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from '../messagerie/messages.service';
import { MessageEntity } from '../messagerie/entity/messages.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { TrophiesService } from '../trophies/trophies.service';
import { TrophiesEntity } from '../trophies/entity/trophies.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameEntity,
      UserEntity,
      MessageEntity,
      NotificationEntity,
      TrophiesEntity,
    ]),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameEvents,
    ConfigService,
    JwtService,
    MessageService,
    NotificationService,
    TrophiesService,
  ],
})
export class GameModule {}
