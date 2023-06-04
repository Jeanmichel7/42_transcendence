import { Module } from '@nestjs/common';
import { GameEvents } from './game.event';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GameController],
  providers: [GameService, GameEvents, ConfigService, JwtService],
})
export class GameModule {}
