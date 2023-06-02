import { Module } from '@nestjs/common';
import { GameEvents } from './game.event';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './entity/game.entity';
import { UserEntity } from '../users/entity/users.entity';
// import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, UserEntity])],
  providers: [GameService, GameEvents, JwtService],
  controllers: [GameController],
})
export class GameModule {}
