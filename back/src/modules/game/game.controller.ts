import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { GameService } from './game.service';
// import { Public } from 'src/modules/auth/decorators/public.decorator';
import { RequestWithUser } from '../auth/interfaces/request.user.interface';
import { GameInterface } from './interfaces/game.interface';

@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  async getGame(
    @Param('id', ParseIntPipe) gameId: bigint,
    @Req() req: RequestWithUser,
  ) {
    return await this.gameService.getGame(req.user.id, gameId);
  }

  @Get('allUserGames')
  async getAllGames(@Req() req: RequestWithUser) {
    return await this.gameService.getAllUserGames(req.user.id);
  }

  @Get('users/:userId/allUserGames')
  async getAllGamesWithUser(@Param('userId', ParseIntPipe) userId: bigint) {
    return await this.gameService.getAllUserGames(userId);
  }

  @Patch('users/:userId/invite')
  async invite(
    @Param('userId', ParseIntPipe) userIdToTinvite: bigint,
    @Req() req: RequestWithUser,
  ): Promise<GameInterface> {
    return await this.gameService.saveInviteGame(req.user.id, userIdToTinvite);
  }

  @Patch(':gameId/accept')
  async accept(
    @Param('gameId', ParseIntPipe) gameId: bigint,
    @Req() req: RequestWithUser,
  ): Promise<GameInterface> {
    return await this.gameService.saveAcceptGame(req.user.id, gameId);
  }

  @Patch(':gameId/decline')
  async decline(
    @Param('gameId', ParseIntPipe) gameId: bigint,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.gameService.saveDeclineGame(req.user.id, gameId);
  }
}
