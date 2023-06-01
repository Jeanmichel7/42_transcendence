import { Module } from '@nestjs/common';
import { GameEvents } from './game.event';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameEvents],
})
export class GameModule {}
