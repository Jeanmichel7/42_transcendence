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

  @Get('test')
  test() {
    return this.gameService.test();
  }

  @Post('test2')
  test2() {
    return this.gameService.test2();
  }

  /* test save create game en dur */
  @Get('createGame')
  async createGame(@Req() req: RequestWithUser) {
    // const player2: bigint = 4;
    return this.gameService.saveNewGame(req.user.id, req.user.id);
  }

  /* test save end game en dur */
  @Get('endGame')
  async endGame(@Req() req: RequestWithUser) {
    return this.gameService.saveEndGame(req.user.id, req.user.id, 10, 5);
  }

  @Get('allUserGames')
  async getAllGames(@Req() req: RequestWithUser) {
    return this.gameService.getAllUserGames(req.user.id);
  }

  @Get('users/:userId/allUserGames')
  async getAllGamesWithUser(@Param('userId', ParseIntPipe) userId: bigint) {
    return this.gameService.getAllUserGames(userId);
  }
}
