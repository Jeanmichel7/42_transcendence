import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { MessageService } from './messages.service';
import { MessageInterface } from './interfaces/message.interface';
import { MessageBtwTwoUserInterface } from './interfaces/messageBetweenTwoUsers.interface';
import { RequestWithUser } from '../auth/interfaces/request.user.interface';
import { MessageCreateDTO } from './dto/message.create.dto';
import { MessagePatchDTO } from './dto/message.patch.dto';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly MessageService: MessageService) {}

  @Get()
  async findAllOfUser(
    @Req() req: RequestWithUser,
  ): Promise<MessageInterface[]> {
    const result: MessageInterface[] =
      await this.MessageService.getAllMessageOfUser(req.user.id);
    return result;
  }

  @Get('users/:userIdDest')
  async getMessages(
    @Req() req: RequestWithUser,
    @Param('userIdDest', ParseIntPipe) userIdDest: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<MessageBtwTwoUserInterface[]> {
    let result: MessageBtwTwoUserInterface[] = [];
    if (page) {
      result = await this.MessageService.getMessagesBetweenUsersPaginate(
        req.user.id,
        userIdDest,
        page,
        offset,
      );
    } else {
      result = await this.MessageService.getMessagesBetweenUsers(
        req.user.id,
        userIdDest,
      );
    }
    return result;
  }

  @Post('users/:userIdTo/send')
  @UsePipes(ValidationPipe)
  async createMessage(
    @Req() req: RequestWithUser,
    @Param('userIdTo', ParseIntPipe) userIdTo: bigint,
    @Body() newMessage: MessageCreateDTO,
  ): Promise<MessageInterface> {
    const message: MessageInterface = await this.MessageService.createMessage(
      newMessage,
      req.user.id,
      userIdTo,
    );
    return message;
  }

  @Patch(':messageId')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async patchMessage(
    @Req() req: RequestWithUser,
    @Param('messageId', ParseIntPipe) id: bigint,
    @Body() updateMessage: MessagePatchDTO,
  ): Promise<MessageInterface> {
    const result = await this.MessageService.patchMessage(
      req.user,
      id,
      updateMessage,
    );
    return result;
  }

  @Delete(':messageId/')
  async deleteMessage(
    @Param('messageId', ParseIntPipe) id: bigint,
    @Req() req: RequestWithUser,
  ): Promise<HttpStatus> {
    const isDelete = await this.MessageService.deleteMessage(req.user, id);
    if (isDelete) return HttpStatus.OK; // 200
    else return HttpStatus.NOT_FOUND; // 404
  }

  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  @Get()
  @UseGuards(AuthAdmin)
  async adminFindAll(): Promise<MessageInterface[]> {
    const result: MessageInterface[] = await this.MessageService.findAll();
    return result;
  }

  @Get(':messageId')
  @UseGuards(AuthAdmin)
  async AdminFindOne(
    @Param('messageId', ParseIntPipe) id: bigint,
  ): Promise<MessageInterface> {
    const result: MessageInterface = await this.MessageService.findOne(id);
    return result;
  }

  @Get('/between/:userId/and/:userIdTo')
  @UseGuards(AuthAdmin)
  async adminGetMessages(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('userIdTo', ParseIntPipe) userIdTo: bigint,
  ): Promise<MessageBtwTwoUserInterface[]> {
    const result: MessageBtwTwoUserInterface[] =
      await this.MessageService.getMessagesBetweenUsers(userId, userIdTo);
    return result;
  }
}
