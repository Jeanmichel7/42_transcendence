import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

import { NotificationInterface } from './interfaces/notification.interface';
import { RequestWithUser } from '../auth/interfaces/request.user.interface';
import { NotificationCreateDTO } from './dto/notification.create.dto';
// import { AuthAdmin } from '../auth/guard/authAdmin.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findNotifsNotRead(
    @Req() req: RequestWithUser,
  ): Promise<NotificationInterface[]> {
    const result: NotificationInterface[] =
      await this.notificationService.findNotifsNotRead(req.user.id);
    return result;
  }

  @Post()
  async createNotification(
    @Body() notification: NotificationCreateDTO,
  ): Promise<NotificationInterface> {
    const result: NotificationInterface =
      await this.notificationService.createNotification(notification);
    return result;
  }

  @Patch(':id/read')
  async readNotification(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: bigint,
  ): Promise<void> {
    await this.notificationService.readNotification(req.user.id, id);
  }
}
