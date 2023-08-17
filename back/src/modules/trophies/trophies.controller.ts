import { Controller, Get, Param, Req } from '@nestjs/common';
import { TrophiesService } from './trophies.service';
import { RequestWithUser } from '../auth/interfaces/request.user.interface';

@Controller('trophies')
export class TrophiesController {
  constructor(private readonly trophiesService: TrophiesService) {}

  @Get('all')
  async getAllTrophies() {
    return await this.trophiesService.getAllTrophies();
  }

  @Get('user')
  async getUserTrophies(@Req() req: RequestWithUser) {
    return await this.trophiesService.getUserTrophies(req.user.login);
  }

  @Get('user/:login')
  async getUserIdTrophies(@Param('login') login: string) {
    return await this.trophiesService.getUserTrophies(login);
  }
}
