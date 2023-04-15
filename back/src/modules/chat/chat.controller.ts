import { Body, Get, Controller, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';

import { ChatCreateMsgDTO } from './dto/chat.createMessage.dto';
import { ChatCreateRoomDTO } from './dto/chat.createRoom.dto';
// import { AuthOwnerAdmin } from '../auth/guard/authAdminOwner.guard';
import { ChatMsgInterface } from './interfaces/chat.message.interface';
import { ChatRoomInterface } from './interfaces/chat.room.interface';
import { ChatService } from './chat.service';
import { RequestWithUser } from '../users/interfaces/request.user.interface';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly ChatService: ChatService,
  ) { }

  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  @Get('room/add')
  async createRoom(
    @Req() req: RequestWithUser,
    @Body() room: ChatCreateRoomDTO
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.createRoom(req.user.id, room);
    return result;
  }








  /* ************************************************ */
  /*                      MESSAGE                     */
  /* ************************************************ */

  @Post('room/:roomId/message/add')
  // @UseGuards(AuthOwnerAdmin)
  @UsePipes(ValidationPipe)
  async createMessage(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Body() newMessage: ChatCreateMsgDTO
  ): Promise< ChatMsgInterface > {
    const message: ChatMsgInterface = await this.ChatService.createMessage(newMessage, req.user.id, roomId);
    return message;
  }





  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  @Get('room/all')
  async getAllRooms(): Promise<ChatRoomInterface[]> {
    const rooms: ChatRoomInterface[] = await this.ChatService.getAllRooms();
    return rooms;
  }












}
