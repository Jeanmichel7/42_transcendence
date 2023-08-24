import { ChatService } from './chat.service';
import { ChatMsgInterface } from './interfaces/chat.message.interface';
import { ChatRoomInterface } from './interfaces/chat.room.interface';
import { RequestWithUser } from '../auth/interfaces/request.user.interface';
import { ChatCreateRoomDTO } from './dto/chat.room.create.dto';
import { ChatUpdateRoomDTO } from './dto/chat.room.update.dto';
import { ChatJoinRoomDTO } from './dto/chat.room.join.dto';
import { ChatMuteUserDTO } from './dto/chat.room.mute.dto';
import { ChatCreateMsgDTO } from './dto/chat.message.create.dto';
import { ChatEditMsgDTO } from './dto/chat.message.edit.dto';
import { AdminRoomGuard } from './guard/room.admin.guard';
import { OwnerRoomGuard } from './guard/room.owner.guard';
import { UserNotMutedGuard } from './guard/room.isMuted.guard';
import { UserNotBannedGuard } from './guard/room.isBanned.guard';
import { AuthAdmin } from '../auth/guard/authAdmin.guard';
import {
  Body,
  Get,
  Controller,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Patch,
  Delete,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  @Get('rooms/public')
  async getAllRoomsToDisplay(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ChatRoomInterface[]> {
    const rooms: ChatRoomInterface[] =
      await this.ChatService.getAllRoomsToDisplay(page, limit);
    return rooms;
  }

  @Get('rooms/public/count')
  async getAllRoomsToDisplayCount(): Promise<number> {
    const count: number = await this.ChatService.getAllRoomsToDisplayCount();
    return count;
  }

  @Get('rooms/:roomId')
  async getRoom(
    @Req() req: RequestWithUser,
    @Param('roomId', ParseIntPipe) roomId: bigint,
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomInterface = await this.ChatService.getRoom(
      req.user.id,
      roomId,
    );
    return room;
  }

  @Post('rooms/add')
  async createRoom(
    @Req() req: RequestWithUser,
    @Body() room: ChatCreateRoomDTO,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.createRoom(
      req.user.id,
      room,
    );
    return result;
  }

  // Patch room
  @UseGuards(OwnerRoomGuard)
  @Patch('rooms/:roomId')
  async updateRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Body() roomData: ChatUpdateRoomDTO,
  ) {
    const result: ChatRoomInterface = await this.ChatService.updateRoom(
      req.user.id,
      roomId,
      roomData,
    );
    return result;
  }

  //invite user
  @Patch('rooms/:roomId/users/:userId/invite')
  async inviteUser(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Param('userId') userId: bigint,
  ) {
    const result: ChatRoomInterface = await this.ChatService.inviteUser(
      req.user.id,
      roomId,
      userId,
    );
    return result;
  }

  // delete room
  @UseGuards(OwnerRoomGuard)
  @Delete('rooms/:roomId')
  async deleteRoom(
    @Param('roomId') roomId: bigint,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.deleteRoom(roomId);
    return result;
  }

  // join room
  @UseGuards(UserNotBannedGuard)
  @Post('rooms/:roomId/join')
  async joinRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Body() data: ChatJoinRoomDTO,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.joinRoom(
      req.user.id,
      roomId,
      data,
    );
    return result;
  }

  @UseGuards(UserNotBannedGuard)
  @Post('rooms/:roomId/decline')
  async declineRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
  ): Promise<void> {
    await this.ChatService.declineRoom(req.user.id, roomId);
  }

  // leave room
  @Patch('rooms/:roomId/leave')
  async leaveRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.leaveRoom(
      req.user.id,
      roomId,
    );
    return result;
  }

  // add admin
  @UseGuards(OwnerRoomGuard)
  @Patch('rooms/:roomId/users/:userIdToBeAdmin/admins/add')
  async addAdminToRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Param('userIdToBeAdmin') userIdToBeAdmin: bigint,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.addAdminToRoom(
      req.user.id,
      roomId,
      userIdToBeAdmin,
    );
    return result;
  }

  // remove admin
  @UseGuards(OwnerRoomGuard)
  @Patch('rooms/:roomId/users/:userIdAdmin/admins/remove')
  async removeAdminToRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Param('userIdAdmin') userIdAdmin: bigint,
  ) {
    const result: ChatRoomInterface = await this.ChatService.removeAdminToRoom(
      req.user.id,
      roomId,
      userIdAdmin,
    );
    return result;
  }

  // mute user
  @UseGuards(AdminRoomGuard)
  @Post('rooms/:roomId/users/:userIdToBeMuted/mute')
  async muteUser(
    @Param('roomId') roomId: bigint,
    @Param('userIdToBeMuted') userIdToBeMuted: bigint,
    @Body() data: ChatMuteUserDTO,
  ): Promise<ChatRoomInterface> {
    const muteDurationSec = data.muteDurationSec ? data.muteDurationSec : '10';
    const result: ChatRoomInterface = await this.ChatService.muteUser(
      roomId,
      userIdToBeMuted,
    );

    setTimeout(async () => {
      try {
        await this.ChatService.demuteUser(roomId, userIdToBeMuted);
      } catch (e) {
        console.log(e);
      }
    }, parseInt(muteDurationSec) * 1000);

    return result;
  }

  // demute user
  @UseGuards(AdminRoomGuard)
  @Patch('rooms/:roomId/users/:userIdToBeDemuted/unmute')
  async demuteUser(
    @Param('roomId') roomId: bigint,
    @Param('userIdToBeDemuted') userIdToBeDemuted: bigint,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.demuteUser(
      roomId,
      userIdToBeDemuted,
    );
    return result;
  }

  // kick user
  @UseGuards(AdminRoomGuard)
  @Patch('rooms/:roomId/users/:userIdToBeKicked/kick')
  async kickUser(
    @Param('roomId') roomId: bigint,
    @Param('userIdToBeKicked') userIdToBeKicked: bigint,
  ): Promise<ChatRoomInterface> {
    const result: ChatRoomInterface = await this.ChatService.kickUser(
      roomId,
      userIdToBeKicked,
    );
    return result;
  }

  // ban user
  @UseGuards(AdminRoomGuard)
  @Patch('rooms/:roomId/users/:userIdToBeBanned/ban')
  async banUser(
    @Param('roomId') roomId: bigint,
    @Param('userIdToBeBanned') userIdToBeBanned: bigint,
  ) {
    const result: ChatRoomInterface = await this.ChatService.banUser(
      roomId,
      userIdToBeBanned,
    );
    return result;
  }

  // unban user
  @UseGuards(AdminRoomGuard)
  @Patch('rooms/:roomId/users/:userIdToBeUnbanned/unban')
  async unbanUser(
    @Param('roomId') roomId: bigint,
    @Param('userIdToBeUnbanned') userIdToBeUnbanned: bigint,
  ) {
    const result: ChatRoomInterface = await this.ChatService.unbanUser(
      roomId,
      userIdToBeUnbanned,
    );
    return result;
  }

  /* ************************************************ */
  /*                      MESSAGE                     */
  /* ************************************************ */

  @Get('rooms/:roomId/messages')
  async getMessages(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<ChatMsgInterface[]> {
    let messages: ChatMsgInterface[] = [];
    if (page) {
      messages = await this.ChatService.getRoomMessagesPaginate(
        req.user.id,
        roomId,
        page,
        offset,
      );
    } else {
      messages = await this.ChatService.getRoomAllMessages(req.user.id, roomId);
    }
    return messages;
  }

  @UseGuards(UserNotMutedGuard)
  @Post('rooms/:roomId/messages/add')
  @UsePipes(ValidationPipe)
  async createMessage(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: bigint,
    @Body() newMessage: ChatCreateMsgDTO,
  ): Promise<ChatMsgInterface> {
    const message: ChatMsgInterface = await this.ChatService.createMessage(
      newMessage,
      req.user.id,
      roomId,
    );
    return message;
  }

  // edit message
  @Patch('messages/:messageId/edit')
  async editMessage(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: bigint,
    @Body() data: ChatEditMsgDTO,
  ): Promise<ChatMsgInterface> {
    const message: ChatMsgInterface = await this.ChatService.editMessage(
      req.user.id,
      messageId,
      data,
    );
    return message;
  }

  // delete message
  @Delete('messages/:messageId/delete')
  async deleteMessage(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: bigint,
  ): Promise<HttpStatus> {
    const isDelete: boolean = await this.ChatService.deleteMessage(
      req.user.id,
      messageId,
    );
    if (isDelete) return HttpStatus.OK; // 200
    else return HttpStatus.NOT_FOUND; // 404
  }

  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  @UseGuards(AuthAdmin)
  @Get('rooms/all')
  async getAllRooms(): Promise<ChatRoomInterface[]> {
    const rooms: ChatRoomInterface[] = await this.ChatService.getAllRooms();
    return rooms;
  }
}
