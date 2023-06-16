import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { GameService } from './game.service';
// import { Public } from 'src/modules/auth/decorators/public.decorator';
import { RequestWithUser } from '../users/interfaces/request.user.interface';

@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('allUserGames')
  async getAllGames(@Req() req: RequestWithUser) {
    return this.gameService.getAllUserGames(req.user.id);
  }

  @Get('users/:userId/allUserGames')
  async getAllGamesWithUser(@Param('userId', ParseIntPipe) userId: bigint) {
    return this.gameService.getAllUserGames(userId);
  }
}
