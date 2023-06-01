import { Controller, Get, Post} from '@nestjs/common';
import { GameService } from './game.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get('test')
  test()  {
    return this.gameService.test(); 
  }
  @Post('test2')
  test2()
  {
    return this.gameService.test2(); 
  }



}