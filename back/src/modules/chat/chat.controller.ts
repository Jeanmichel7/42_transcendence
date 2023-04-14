import { Body, Get, Controller, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { ChatCreateMsgDTO } from './dto/chat.create.dto';
import { AuthOwnerAdmin } from '../auth/guard/authAdminOwner.guard';
import { ChatMsgInterface } from './interfaces/chat.message.interface';
import { ChatRoomInterface } from './interfaces/chat.room.interface';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly ChatService: ChatService,
  ) { }

  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  @Get('createRoom/:userId')
  // @UseGuards(AuthOwnerAdmin)
  async createRoom(@Param('userId', ParseIntPipe) userId: bigint): Promise<ChatRoomInterface> {
    const room: ChatRoomInterface = await this.ChatService.createRoom(userId);
    return room;
  }







  /* ************************************************ */
  /*                      MESSAGE                     */
  /* ************************************************ */

  @Post('/from/:userId/to/:roomId')
  // @UseGuards(AuthOwnerAdmin)
  @UsePipes(ValidationPipe)
  async createMessage(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('roomId', ParseIntPipe) roomId: bigint,
    @Body() newMessage: ChatCreateMsgDTO
  ): Promise< ChatMsgInterface > {
    const message: ChatMsgInterface = await this.ChatService.createMessage(newMessage, userId, roomId);
    return message;
  }


}
